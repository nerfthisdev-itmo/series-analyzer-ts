import numpy as np

# Number of data points to generate
num_points = 100

# Generate random integer X1 and X2 between -10 and 10
X1 = np.random.randint(-100, 101, num_points)
X2 = np.random.randint(-100, 101, num_points)

# Compute Y with small noise, then round to nearest integer
# noise = np.random.normal(0, 1, num_points)  # small Gaussian noise
Y = 2 * X1 + 3 * X2 + 5 #+ noise
Y = np.round(Y).astype(int)

# Combine into an array of [X1, X2, Y]
data = np.column_stack((X1, X2, Y))

# Optional: print first few rows
print("First 5 generated points:")
for i in range(5):
    print(f"X1 = {X1[i]}, X2 = {X2[i]}, Y = {Y[i]}")

# Optional: save to CSV file
np.savetxt("generated_points_ints.csv", data, delimiter=",", fmt="%d", header="X1,X2,Y", comments="")
print(X1)
print()
print(X2)
print()
print(Y)
