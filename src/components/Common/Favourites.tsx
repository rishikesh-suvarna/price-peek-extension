interface FavouritesProps {
    favourites: string[];
    setSymbol: (symbol: string) => void;
}

const Favourites = ({
    favourites,
    setSymbol
}: FavouritesProps) => {
    return (
        <ul className="flex flex-wrap items-center gap-1 pills-wrapper">
            {favourites.map((stock, index) => (
                <li key={index} className="item-pills">
                    <button className="flex items-center gap-2" onClick={() => setSymbol(stock)}>
                        {stock}
                    </button>
                </li>
            ))}
        </ul>
    )
}

export default Favourites