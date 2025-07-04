const DISTINCT_CATEGORY_LOWER_BOUND = 5;

export function parseKeyString(keyStr: string): { start: number; end: number } {
  if (keyStr.startsWith("[")) {
    const closingBracketIndex = keyStr.lastIndexOf("]");
    const closingParenIndex = keyStr.lastIndexOf(")");
    const endsWith =
      closingBracketIndex > -1 ? "]" : closingParenIndex > -1 ? ")" : "";
    const content = keyStr.substring(
      1,
      keyStr.length - 1 - (endsWith === ")" ? 1 : 0),
    );
    const parts = content.split(",").map((part) => part.trim());
    const start = parseFloat(parts[0]);
    const end = parseFloat(parts[1]);
    return { start, end };
  } else {
    const num = parseFloat(keyStr.toString());
    return { start: num, end: num };
  }
}

export function mergeCategoriesByLowerBound(
  empiricalData: Record<string, number>,
  theoreticalData: Record<string, number>,
  lowerBound = DISTINCT_CATEGORY_LOWER_BOUND,
): {
  mergedEmpirical: Record<string, number>;
  mergedTheoretical: Record<string, number>;
} {
  const mergedEmpirical: Record<string, number> = {};
  const mergedTheoretical: Record<string, number> = {};

  let bufferEmpiricalSum = 0;
  let bufferTheoreticalSum = 0;
  const buffer: Array<{ key_str: string }> = [];

  Object.entries(empiricalData).forEach(([key_str, empiricalValue]) => {
    const theoreticalValue = theoreticalData[key_str] || 0;

    buffer.push({ key_str });
    bufferEmpiricalSum += empiricalValue;
    bufferTheoreticalSum += theoreticalValue;

    if (bufferTheoreticalSum >= lowerBound) {
      const firstKeyStr = buffer[0].key_str;
      const lastKeyStr = buffer[buffer.length - 1].key_str;

      const { start: firstStart } = parseKeyString(firstKeyStr);
      const { end: lastEnd } = parseKeyString(lastKeyStr);

      const mergedKey =
        firstStart === lastEnd
          ? `${firstStart}`
          : `[${firstStart}, ${lastEnd}]`;

      mergedEmpirical[mergedKey] = bufferEmpiricalSum;
      mergedTheoretical[mergedKey] = bufferTheoreticalSum;

      // Reset buffer
      bufferEmpiricalSum = 0;
      bufferTheoreticalSum = 0;
      buffer.length = 0;
    }
  });

  // Handle remaining buffer
  if (buffer.length > 0) {
    if (Object.keys(mergedEmpirical).length > 0) {
      const lastMergedKey = Object.keys(mergedEmpirical).pop()!;
      const { start: lastStart } = parseKeyString(lastMergedKey);
      const { end: bufferLastEnd } = parseKeyString(
        buffer[buffer.length - 1].key_str,
      );

      const newStart = lastStart;
      const newEnd = bufferLastEnd;
      const newMergedKey =
        newStart === newEnd ? `${newStart}` : `[${newStart}, ${newEnd}]`;

      mergedEmpirical[newMergedKey] =
        mergedEmpirical[lastMergedKey] + bufferEmpiricalSum;
      mergedTheoretical[newMergedKey] =
        mergedTheoretical[lastMergedKey] + bufferTheoreticalSum;

      delete mergedEmpirical[lastMergedKey];
      delete mergedTheoretical[lastMergedKey];
    } else {
      const firstKeyStr = buffer[0].key_str;
      const lastKeyStr = buffer[buffer.length - 1].key_str;

      const { start: firstStart } = parseKeyString(firstKeyStr);
      const { end: lastEnd } = parseKeyString(lastKeyStr);

      const mergedKey =
        firstStart === lastEnd
          ? `${firstStart}`
          : `[${firstStart}, ${lastEnd}]`;

      mergedEmpirical[mergedKey] = bufferEmpiricalSum;
      mergedTheoretical[mergedKey] = bufferTheoreticalSum;
    }
  }

  // Final validation: ensure all theoretical frequencies ≥ 5
  for (const key in mergedTheoretical) {
    if (mergedTheoretical[key] < DISTINCT_CATEGORY_LOWER_BOUND) {
      console.warn(
        `Expected frequency for category "${key}" is below threshold: ${mergedTheoretical[key]}.`,
      );
    }
  }

  return { mergedEmpirical, mergedTheoretical };
}
