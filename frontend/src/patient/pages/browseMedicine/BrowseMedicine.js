import classes from "./BrowseMedicine.module.css"
import {useRef,useContext,useState, useEffect} from 'react';

const BrowseMedicine = () => {
    const userCtx = useContext(UserContext);
    const cartCtx = useContext(CartContext);
    const [categoryIndex, setCategoryIndex] = useState(-1);
    const [sectionSearchText, setSectionSearchText] = useState("");
    const [searchText, setSearchText] = useState("");
    const [allMedicines, setAllMedicine] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const medicineResultsRef = useRef();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:4000/pharmacy', {
                    method: 'GET',
                    headers: { 'Content-type': 'application/json' },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();

                const medicineJson = result.data.Medicine;
                setAllMedicine(
                    medicineJson.map((m) => {
                        return {
                            id: m._id,
                            cartQuantity: 1,
                            ...m,
                        };
                    })
                );
                setMedicines(
                    medicineJson.map((m) => {
                        return {
                            id: m._id,
                            name: m.name,
                            image: m.image,
                            description: m.description,
                            price: m.price,
                            sales: m.sales,
                            cartQuantity: 1,
                            quantity: m.quantity,
                            medicinalUse: m.medicinalUse,
                            archived: m.archived,
                            activeIngredients: m.activeIngredients
                        };
                    })
                );
                fetchCart(
                    medicineJson.map((m) => {
                        return {
                            id: m._id,
                            name: m.name,
                            image: m.image,
                            description: m.description,
                            price: m.price,
                            sales: m.sales,
                            cartQuantity: 1,
                            quantity: m.quantity,
                        };
                    })
                );
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        filterMedicine();
    }, [categoryIndex, searchText]);

    const filterMedicine = () => {
        setMedicines(() => {
            let medicines = [...allMedicines];
            if (categoryIndex != -1) {
                medicines = medicines.filter((medicine) =>
                    medicine.medicinalUse == (categoryIndex < 5 ? categories1[categoryIndex].title : categories2[categoryIndex - 5].title));
            }
            if (searchText !== "") {
                medicines = medicines.filter((medicine) => medicine.name.includes(searchText));
            }
            return medicines;
        });
    }

    const fetchCart = async (medicines) => {
        if (cartCtx.length == 0 && userCtx.role === 'patient') {
            const response = await fetch(
                `http://localhost:4000/patients/${userCtx.userId}/cart`,
                { credentials: 'include' }
            );
            const cartJson = await response.json();
            const cart = cartJson.cart ?? [];
            cart.forEach((item) => {
                const medicine = medicines.find(
                    (medicineItem) => medicineItem.id == item.id
                );
                cartCtx.initItem({
                    id: item.id,
                    image: medicine.image,
                    name: medicine.name,
                    description: medicine.description,
                    price: medicine.price,
                    quantity: +item.quantity,
                });
            });
        }
    };

    const getCategoryTiles = () => {
        const handleSelectCategory = (index) => {
            if (categoryIndex == index) {
                setCategoryIndex(-1);
            } else {
                setCategoryIndex(index);
            }
        }
        return <div>
            <div className={classes.categoriesWrapper}>
                {categories1.map(category => {
                    return <div className={`${classes.categoryTile} ${categoryIndex == category.index ? classes.active : ""}`} onClick={() => handleSelectCategory(category.index)}>
                        <img height={40} src={category.img} />
                        <div className={classes.categoryTitle}>{category.title}</div>
                    </div>
                })}
            </div>
            <div className={classes.categoriesWrapper}>
                {categories2.map(category => {
                    return <div className={`${classes.categoryTile} ${categoryIndex == category.index ? classes.active : ""}`} onClick={() => handleSelectCategory(category.index)}>
                        <img height={40} src={category.img} />
                        <div className={classes.categoryTitle}>{category.title}</div>
                    </div>
                })}
            </div>
        </div>
    }

    const getMedicine = (medicine) => {
        let ingredients = medicine.activeIngredients;
        if (ingredients != null) {
            ingredients = ingredients.join(', ')
        }

        const addItem = (e) => {
            e.preventDefault();
            cartCtx.addItem({
                id: medicine.id,
                image: medicine.image,
                name: medicine.name,
                price: medicine.price,
                description: medicine.description,
                price: medicine.price,
                quantity: +medicine.cartQuantity,
            });
        };
        return <div className="col-3 px-4"><div className={classes.medicineContainer}>
            <div>
                <div className={classes.medicineImg}><img src={medicine.image} /></div>
                <div className={classes.medicineTitle}>{medicine.name}</div>
            </div>
            <div>
                <div className={classes.medicinePrice}>{medicine.price} L.E.</div>
                <div className={classes.medicineDesc1}>Active Ingredient:</div>
                <div className={classes.medicineDesc2}>{ingredients}</div>
                <div className="d-flex mt-2">
                    <div className={`${classes.addToCartButton} me-1`} onClick={addItem}>Add To Cart</div>
                    <div className={`${classes.viewButton} ms-1`}>View</div>
                </div>
            </div>
        </div>
        </div>;
    }

    return <section className={classes.medicineSection}>
        <div className={classes.medicineSectionTitle}>BROWSE MEDICINE</div>
        <div className={classes.medicineSearchContainer}>
            <div className={classes.medicineSearchIcon}><img width={30} src={searchIconImg} alt=''/></div>
            <input className={classes.medicineSearchInput} value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search" />
        </div>
        {getCategoryTiles()}
        <div ref={medicineResultsRef} className={classes.divider}>
            <div style={{ flex: "60%", backgroundColor: "#1BC768", borderRadius: "5px 0 0 5px" }} />
            <div style={{ flex: "40%", backgroundColor: "#86F1E2", borderRadius: "5px" }} />
        </div>
        <div className={classes.resultsContainer}>
            {medicines.map(medicine => getMedicine(medicine))}
        </div>
    </section>
}

export default BrowseMedicine;

const categories1 = [
    { img: feverImg, title: "Fever", index: 0 },
    { img: headacheImg, title: "Headache", index: 1 },
    { img: eyeImg, title: "Eyes", index: 2 },
    { img: lungsImg, title: "Cough", index: 3 },
    { img: nutritionImg, title: "Nutrition", index: 4 },
];

const categories2 = [
    { img: babyImg, title: "Baby Products", index: 5 },
    { img: brokenArmImg, title: "Pain Relief", index: 6 },
    { img: stomachImg, title: "Stomach", index: 7 },
    { img: insomniaImg, title: "Insomnia", index: 8 },
    { img: firstaidImg, title: "First Aid", index: 9 },
]