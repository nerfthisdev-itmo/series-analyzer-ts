#!/usr/bin/env python3
"""
Generate sample data from common probability distributions and save to a file.

Supported distributions:
  - normal      (Gaussian)
  - binomial
  - poisson
  - laplace     (Double exponential)
  - geometric
  - uniform
  - exponential

Each number is formatted with a dot (.) as decimal separator and values are
separated by ', ' in the output file.
"""

import numpy as np
import argparse
import sys
from typing import Dict, Any, Tuple

# Default parameters for each distribution
DEFAULT_PARAMS: Dict[str, Dict[str, Any]] = {
    "normal": {"loc": 0.0, "scale": 1.0},
    "binomial": {"n": 10, "p": 0.5},
    "poisson": {"lam": 3.0},
    "laplace": {"loc": 0.0, "scale": 1.0},
    "geometric": {"p": 0.5},
    "uniform": {"low": 0.0, "high": 1.0},
    "exponential": {"scale": 1.0},
}

def generate_samples(dist_type: str, size: int, params: Dict[str, Any], seed: int = None) -> np.ndarray:
    """Generate samples using numpy based on distribution type and parameters."""
    if seed is not None:
        np.random.seed(seed)

    try:
        if dist_type == "normal":
            return np.random.normal(loc=params["loc"], scale=params["scale"], size=size)
        elif dist_type == "binomial":
            return np.random.binomial(n=params["n"], p=params["p"], size=size)
        elif dist_type == "poisson":
            return np.random.poisson(lam=params["lam"], size=size)
        elif dist_type == "laplace":
            return np.random.laplace(loc=params["loc"], scale=params["scale"], size=size)
        elif dist_type == "geometric":
            # NumPy's geometric returns number of trials until first success (>=1)
            return np.random.geometric(p=params["p"], size=size)
        elif dist_type == "uniform":
            return np.random.uniform(low=params["low"], high=params["high"], size=size)
        elif dist_type == "exponential":
            return np.random.exponential(scale=params["scale"], size=size)
        else:
            raise ValueError(f"Unsupported distribution: {dist_type}")
    except Exception as e:
        print(f"Error generating samples for '{dist_type}': {e}", file=sys.stderr)
        sys.exit(1)


def save_to_file(data: np.ndarray, filename: str, separator: str = ", ", decimal_places: int = None):
    """Save 1D array to file with dot decimal separator and custom separator."""
    if decimal_places is not None:
        data = np.round(data, decimal_places)

    # Convert to strings (NumPy uses '.' by default)
    str_data = [str(x) for x in data]

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(separator.join(str_data))
    print(f"✅ Saved {len(data)} samples to '{filename}'")


def parse_distribution_params(args: argparse.Namespace) -> Dict[str, Any]:
    """Extract and validate distribution-specific parameters from CLI args."""
    dist = args.distribution
    params = {}

    if dist == "normal":
        params["loc"] = args.loc
        params["scale"] = args.scale
    elif dist == "binomial":
        if args.n < 0:
            raise ValueError("n (number of trials) must be non-negative")
        if not (0 <= args.p <= 1):
            raise ValueError("p (success probability) must be between 0 and 1")
        params["n"] = args.n
        params["p"] = args.p
    elif dist == "poisson":
        if args.lam < 0:
            raise ValueError("lam (rate) must be non-negative")
        params["lam"] = args.lam
    elif dist == "laplace":
        params["loc"] = args.loc_laplace
        params["scale"] = args.scale_laplace
    elif dist == "geometric":
        if not (0 < args.p_geo <= 1):
            raise ValueError("p (success probability) must be in (0, 1]")
        params["p"] = args.p_geo
    elif dist == "uniform":
        params["low"] = args.low
        params["high"] = args.high
        if args.low >= args.high:
            raise ValueError("low must be less than high for uniform distribution")
    elif dist == "exponential":
        if args.scale_exp <= 0:
            raise ValueError("scale must be positive for exponential distribution")
        params["scale"] = args.scale_exp

    return params


def main():
    parser = argparse.ArgumentParser(
        description="Generate sample data from common probability distributions.",
        formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument(
        "distribution",
        choices=[
            "normal", "binomial", "poisson", "laplace",
            "geometric", "uniform", "exponential"
        ],
        help="Type of distribution to sample from."
    )
    parser.add_argument(
        "-n", "--size",
        type=int,
        default=1000,
        help="Number of samples to generate (default: 1000)."
    )
    parser.add_argument(
        "-o", "--output",
        type=str,
        default="samples.txt",
        help="Output filename (default: samples.txt)."
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=None,
        help="Random seed for reproducibility."
    )
    parser.add_argument(
        "--decimals",
        type=int,
        default=None,
        help="Round numbers to this many decimal places (optional)."
    )

    # Distribution-specific arguments
    dist_args = parser.add_argument_group("Distribution Parameters")

    # Normal & Laplace share 'loc' and 'scale', but we give them distinct names to avoid conflict
    dist_args.add_argument("--loc", type=float, default=0.0, help="Mean (normal) (default: 0.0)")
    dist_args.add_argument("--scale", type=float, default=1.0, help="Std dev (normal) (default: 1.0)")

    dist_args.add_argument("--n", type=int, default=10, help="Number of trials (binomial) (default: 10)")
    dist_args.add_argument("--p", type=float, default=0.5, help="Success prob (binomial) (default: 0.5)")

    dist_args.add_argument("--lam", type=float, default=3.0, help="Rate (poisson) (default: 3.0)")

    dist_args.add_argument("--loc_laplace", type=float, default=0.0, help="Location (laplace) (default: 0.0)")
    dist_args.add_argument("--scale_laplace", type=float, default=1.0, help="Scale (laplace) (default: 1.0)")

    dist_args.add_argument("--p_geo", type=float, default=0.5, help="Success prob (geometric) (default: 0.5)")

    dist_args.add_argument("--low", type=float, default=0.0, help="Lower bound (uniform) (default: 0.0)")
    dist_args.add_argument("--high", type=float, default=1.0, help="Upper bound (uniform) (default: 1.0)")

    dist_args.add_argument("--scale_exp", type=float, default=1.0, help="Scale = 1/lambda (exponential) (default: 1.0)")

    args = parser.parse_args()

    # Validate size
    if args.size <= 0:
        parser.error("Sample size must be a positive integer.")

    try:
        params = parse_distribution_params(args)
    except ValueError as e:
        print(f"❌ Parameter error: {e}", file=sys.stderr)
        sys.exit(1)

    print(f"🎲 Generating {args.size} samples from '{args.distribution}' distribution...")
    samples = generate_samples(args.distribution, args.size, params, seed=args.seed)

    save_to_file(samples, args.output, separator=", ", decimal_places=args.decimals)


if __name__ == "__main__":
    main()
