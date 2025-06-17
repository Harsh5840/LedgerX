interface NLPQuery {   //NLPQuery is a type that represents the query that the user is asking
    intent: "TOTAL_SPENT" | "TOP_CATEGORIES" | "UNKNOWN";  //intent is the intent of the user's query
    filters: {
        category?: string;  //category is the category of the query
        month?: number;  // 0-indexed (0 = January)
        year?: number;  //year is the year of the query
    };
    limit?: number;  //limit is the limit of the query
}

export function parseUserQuery(question: string): NLPQuery {
    const lower = question.toLowerCase();
    const now = new Date();


    if (lower.includes("how much") && lower.includes("spend")) {
        const categoryMatch = lower.match(/on (\w+)/); //this is a regex to match the category of the query
        const monthMatch = lower.match(/in (\w+)/); //this is a regex to match the month of the query

        const category = categoryMatch?.[1];  //the [] is used to access the first match of the regex
        const monthName = monthMatch?.[1];  //the [] is used to access the first match of the regex
        const monthIndex = monthName ? new Date(`${monthName} 1`).getMonth() : now.getMonth(); //this is a regex to match the month of the query

        return {
            intent: "TOTAL_SPENT",
            filters: {
                category,
                month: monthIndex,
                year: now.getFullYear(),
            },
        };
    }

    // Intent: Top categories
    if (lower.includes("top") && lower.includes("expense")) { //
        const limitMatch = lower.match(/top (\d+)/);  //this is a regex to match the limit of the query
        const limit = limitMatch ? parseInt(limitMatch[1] || '3') : 3;

        return {
            intent: "TOP_CATEGORIES",
            filters: {
                month: now.getMonth(),
                year: now.getFullYear(),
            },
            limit,
        };
    }

    return {
        intent: "UNKNOWN",
        filters: {},
    };
}
