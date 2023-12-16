import NavBar from "../../../shared/components/NavBar/NavBar";
import classes from "./Homepage.module.css";
import sectionRectangleImg from "../../../assets/homepage/sectionRectangle.png";
import sectionMedicineImg from "../../../assets/homepage/sectionMedicine.png";
import searchIconImg from "../../../assets/homepage/searchIcon.png";
import babyImg from "../../../assets/homepage/baby.png";
import brokenArmImg from "../../../assets/homepage/brokenarm.png";
import eyeImg from "../../../assets/homepage/eye.png";
import feverImg from "../../../assets/homepage/fever.png";
import firstaidImg from "../../../assets/homepage/firstaid.png";
import headacheImg from "../../../assets/homepage/headache.png";
import insomniaImg from "../../../assets/homepage/insomnia.png";
import stomachImg from "../../../assets/homepage/kidney.png";
import lungsImg from "../../../assets/homepage/lungs.png";
import nutritionImg from "../../../assets/homepage/nutrition.png";
import { useState } from "react";

const Homepage = () => {
    const [categoryIndex, setCategoryIndex] = useState(-1);

    const getCategoryTiles = () => {
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

    const getMedicine = () => {
        return <div className="col-3 px-4"><div className={classes.medicineContainer}>
            <div>
                <div className={classes.medicineImg}><img height={100} src={babyImg} /></div>
                <div className={classes.medicineTitle}>Covonia Throat Spray - 100ml</div>
            </div>
            <div>
                <div className={classes.medicinePrice}>40 L.E.</div>
                <div className={classes.medicineDesc1}>Active Ingredients:</div>
                <div className={classes.medicineDesc2}>Chlorhexidine Gluconate</div>
                <div className="d-flex mt-2">
                    <div className={`${classes.addToCartButton} me-1`}>Add To Cart</div>
                    <div className={`${classes.viewButton} ms-1`}>View</div>
                </div>
            </div>
        </div>
        </div>;
    }

    return <div>
        <NavBar />
        <section className={classes.welcomeSection}>
            <div className={`col-5 ${classes.sectionLeftCol}`}>
                <div className={classes.sectionTitle}>
                    We can get your Drug Prescription to You
                </div>
                <div className={classes.sectionSubtitle}>
                    We have all the drugs your doctor prescribed for your health and what's more, we can get it to you.
                </div>
                <div className={classes.searchContainer}>
                    <div className={classes.searchIcon}><img width={30} src={searchIconImg} />
                    </div>
                    <input className={classes.searchInput} placeholder="Search for a drug" />

                    <div className={classes.searchButton}>Search</div>
                </div>
            </div>
            <div className="col-7 position-relative">
                <img className={classes.sectionRect} src={sectionRectangleImg} />
                <img className={classes.sectionMedicineImg} src={sectionMedicineImg} />
            </div>
        </section>

        <section className={classes.medicineSection}>
            <div className={classes.medicineSectionTitle}>BROWSE MEDICINE</div>
            <div className={classes.medicineSearchContainer}>
                <div className={classes.medicineSearchIcon}><img width={30} src={searchIconImg} /></div>
                <input className={classes.medicineSearchInput} placeholder="Search" />
            </div>
            {getCategoryTiles()}
            <div className={classes.divider}>
                <div style={{ flex: "60%", backgroundColor: "#1BC768", borderRadius: "5px 0 0 5px" }} />
                <div style={{ flex: "40%", backgroundColor: "#86F1E2", borderRadius: "5px" }} />
            </div>
            <div className={classes.resultsContainer}>
                {getMedicine()}
                {getMedicine()}
                {getMedicine()}
                {getMedicine()}
                {getMedicine()}
                {getMedicine()}
            </div>
        </section>
    </div>
}

export default Homepage;