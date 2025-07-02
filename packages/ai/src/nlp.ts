interface NLPQuery {
  intent: "TOTAL_SPENT" | "TOP_CATEGORIES" | "UNKNOWN";
  filters: {
    category?: string;
    month?: number;
    year?: number;
  };
  limit?: number;
}

function parseMonth(monthStr: string): number | undefined {
  const month = new Date(`${monthStr} 1, 2020`).getMonth();
  return isNaN(month) ? undefined : month;
}

export function parseQuery(question: string): NLPQuery {
  const lower = question.toLowerCase();
  const now = new Date();

  // TOTAL_SPENT: "how much did I spend on food in january"
  if (lower.includes("how much") && lower.includes("spend")) {
    const categoryMatch = lower.match(/on (\w+)/);
    const monthMatch = lower.match(/in (\w+)/);
    const category = categoryMatch?.[1];
    const monthName = monthMatch?.[1];
    const monthIndex = monthName ? parseMonth(monthName) : undefined;

    let filters: NLPQuery["filters"] = {
      category,
      month: monthIndex ?? now.getMonth(),
      year: now.getFullYear(),
    };

    if (lower.includes("last month")) {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      filters.month = lastMonth.getMonth();
      filters.year = lastMonth.getFullYear();
    }

    return {
      intent: "TOTAL_SPENT",
      filters,
    };
  }

  // TOP_CATEGORIES: "top 3 expense categories this month"
  if (lower.includes("top") && lower.includes("expense")) {
    const limitMatch = lower.match(/top (\d+)/);
    const limit = limitMatch ? parseInt(limitMatch[1] as string) : 3;

    let filters: NLPQuery["filters"] = {
      month: now.getMonth(),
      year: now.getFullYear(),
    };

    if (lower.includes("last month")) {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      filters.month = lastMonth.getMonth();
      filters.year = lastMonth.getFullYear();
    }

    return {
      intent: "TOP_CATEGORIES",
      filters,
      limit,
    };
  }

  return {
    intent: "UNKNOWN",
    filters: {},
  };
}
