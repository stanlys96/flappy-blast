export const CarouselData = [
    {
        id: 1,
        currentText: "Guaranteed Floor Price",
        originalText: "Guaranteed Floor Price",
        textHovered:
            "The price can only go up, starting at the initial sale price.",
        isHovered: false,
    },
    {
        id: 2,
        currentText: (
            <div className="flex flex-col gap-1">
                <div>Fairlaunch</div>
                <div className="text-sm">HC: 150ETH</div>
                <div className="text-sm">IC: 0,03-3 ETH</div>
            </div>
        ),
        originalText: (
            <div className="flex flex-col gap-1">
                <div>Fairlaunch</div>
                <div className="text-sm">HC: 150ETH</div>
                <div className="text-sm">IC: 0,03-3 ETH</div>
            </div>
        ),
        textHovered:
            "All ETH raised goes to the liquidity pool—no tokens are held by the devs.",
        isHovered: false,
    },
    {
        id: 3,
        currentText: "Infinity and beyond",
        originalText: "Infinity and beyond",
        textHovered:
            "Trading fees and native yield keep boosting the floor price.",
        isHovered: false,
    },
    {
        id: 4,
        currentText: "Optimized for jackpot",
        originalText: "Optimized for jackpot",
        textHovered: "All criteria filled for jackpot, all is to hype it up !",
        isHovered: false,
    },
];
