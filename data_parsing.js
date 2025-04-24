//const gamblingScoreThreshold = 4; // Define a threshold for gambling score

function aggregateGamblingData(data) {
    const gameScores = {};

    data.forEach(row => {
        const gameName = row.game_id;
        const gamblingScore = parseFloat(row.Item_Gambling_Rating || 0);
        const confidence = parseFloat(row.Confidence || 0);
        const purchaseCount = parseInt(row.n || 0); // Number of purchases
        const purchaseAmount = parseFloat(row.median_amount_USD || 0) ; // Number of purchases
        const totalPurchaseAmount = purchaseAmount * purchaseCount ; // Number of purchases

        if (!gameScores[gameName]) {
            gameScores[gameName] = { totalScore: 0, totalConfidence: 0, purchaseCount: 0, purchaseAmount: 0, itemCount: 0, averageScore : 0 };
        }

        gameScores[gameName].totalScore += gamblingScore * confidence;
        gameScores[gameName].totalConfidence += confidence;
        gameScores[gameName].purchaseCount += purchaseCount;
        gameScores[gameName].purchaseAmount += totalPurchaseAmount;
        
    });

    // Calculate weighted scores
    const aggregatedData = Object.entries(gameScores).map(([gameName, scores]) => ({
        gameName,
        weightedScore: scores.totalConfidence > 0 ? scores.totalScore / scores.totalConfidence : 0,
        purchaseCount: scores.purchaseCount,
        purchaseAmount: scores.purchaseAmount,
    }));

    return aggregatedData.sort((a, b) => b.weightedScore - a.weightedScore).filter(game => game.purchaseCount >= purchaseCountThreshold); // Sort by score descending
}

//Aggregate data for gambling vs non-gambling games to compare spending
function aggregateGamblingVsNonGambling(data) {
    const threshold = 2.5; // Define a threshold for gambling score

    const gamblingData = data.filter(row => row.weightedScore >= gamblingScoreThreshold);
    const nonGamblingData = data.filter(row => row.weightedScore < gamblingScoreThreshold);

    return {
        gambling: gamblingData.sort((a, b) => b.weightedScore - a.weightedScore),
        nonGambling: nonGamblingData.sort((a, b) => b.weightedScore - a.weightedScore)
    };
}

//aggregate data for comparison of in-game spending for non-gambling games

//aggregate data for comparison of gambling games per publisher

//aggregate data for comparison of aknowledge gambling games spending vs non-acknowledge gambling games spending (ignoring fair games)

//aggregate data for comparison of spending in games per publisher

//aggregate data for comparison of spending between 10 most popular game publishers

//aggregate data for comparison of spending in games per genre

//aggregate data for comparison of spending in games per genre combination

