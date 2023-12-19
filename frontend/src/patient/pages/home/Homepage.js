import NavBar from '../../../shared/components/NavBar/NavBar';
import classes from './Homepage.module.css';
import sectionRectangleImg from '../../../assets/homepage/sectionRectangle.png';
import sectionMedicineImg from '../../../assets/homepage/sectionMedicine.png';
import searchIconImg from '../../../assets/homepage/searchIcon.png';
import babyImg from '../../../assets/homepage/baby.png';
import brokenArmImg from '../../../assets/homepage/brokenarm.png';
import eyeImg from '../../../assets/homepage/eye.png';
import feverImg from '../../../assets/homepage/fever.png';
import firstaidImg from '../../../assets/homepage/firstaid.png';
import headacheImg from '../../../assets/homepage/headache.png';
import insomniaImg from '../../../assets/homepage/insomnia.png';
import stomachImg from '../../../assets/homepage/kidney.png';
import lungsImg from '../../../assets/homepage/lungs.png';
import nutritionImg from '../../../assets/homepage/nutrition.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState, useContext } from 'react';
import UserContext from '../../../user-store/user-context';
import CartContext from '../cart/Cart';

const Homepage = () => {
  const userCtx = useContext(UserContext);
  const cartCtx = useContext(CartContext);
  const [categoryIndex, setCategoryIndex] = useState(-1);
  const [sectionSearchText, setSectionSearchText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [allMedicines, setAllMedicine] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const medicineResultsRef = useRef();
  const navigate = useNavigate();

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
                            isOtc: m.isOtc,
                            archived: m.archived,
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
                            isOtc: m.isOtc,
                            archived: m.archived,
                            activeIngredient: m.activeIngredient
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
    }, [categoryIndex, searchText, allMedicines]);

    const filterMedicine = () => {
        setMedicines(() => {
            let medicines = [...allMedicines];
            if (categoryIndex !== -1) {
                medicines = medicines.filter((medicine) =>
                    medicine.medicinalUse === (categoryIndex < 5 ? categories1[categoryIndex].title : categories2[categoryIndex - 5].title)
                );
            }
            if (searchText !== "") {
                medicines = medicines.filter((medicine) => medicine.name.includes(searchText));
            }
            // Add conditions to filter based on "archived" and "isOtc" if role is patient

            if (userCtx.role === 'patient' || userCtx.role === 'pharmacist') {
                medicines = medicines.filter((medicine) => {
                    //medicine.isOtc; // replace with actual property name
                    return !medicine.archived;
                });
            }
            if (userCtx.role === 'patient') {
                medicines = medicines.filter((medicine) => {
                    //medicine.isOtc; // replace with actual property name
                    return medicine.isOtc;
                });
            }

            return medicines;
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
              isOtc: m.isOtc,
              archived: m.archived,
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
              isOtc: m.isOtc,
              archived: m.archived,
              activeIngredient: m.activeIngredient,
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
  }, [categoryIndex, searchText, allMedicines]);

  const filterMedicine = () => {
    setMedicines(() => {
      let medicines = [...allMedicines];
      if (categoryIndex !== -1) {
        medicines = medicines.filter(
          (medicine) =>
            medicine.medicinalUse ===
            (categoryIndex < 5
              ? categories1[categoryIndex].title
              : categories2[categoryIndex - 5].title)
        );
      }
      if (searchText !== '') {
        medicines = medicines.filter((medicine) =>
          medicine.name.includes(searchText)
        );
      }
      // Add conditions to filter based on "archived" and "isOtc" if role is patient

      if (userCtx.role === 'patient' || userCtx.role === 'pharmacist') {
        medicines = medicines.filter((medicine) => {
          //medicine.isOtc; // replace with actual property name
          return !medicine.archived;
        });
      }
      if (userCtx.role === 'patient') {
        medicines = medicines.filter((medicine) => {
          //medicine.isOtc; // replace with actual property name
          return medicine.isOtc;
        });
      }

      return medicines;
    });
  };

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
    };

    return (
      <div>
        <div className={classes.categoriesWrapper}>
          {categories1.map((category) => {
            return (
              <div
                className={`${classes.categoryTile} ${
                  categoryIndex == category.index ? classes.active : ''
                }`}
                onClick={() => handleSelectCategory(category.index)}
              >
                <img height={40} src={category.img} />
                <div className={classes.categoryTitle}>{category.title}</div>
              </div>
            );
          })}
        </div>
        <div className={classes.categoriesWrapper}>
          {categories2.map((category) => {
            return (
              <div
                className={`${classes.categoryTile} ${
                  categoryIndex == category.index ? classes.active : ''
                }`}
                onClick={() => handleSelectCategory(category.index)}
              >
                <img height={40} src={category.img} />
                <div className={classes.categoryTitle}>{category.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getMedicine = (medicine) => {
    let ingredients = medicine.activeIngredient;
    // if (ingredients != null) {
    //     ingredients = ingredients.join(', ')
    // }

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

    const toMedicineDetails = () => {
      navigate('/medicine', { state: medicine });
    };

    return (
      <div className="col-3 px-4">
        <div onClick={toMedicineDetails} className={classes.medicineContainer}>
          <div>
            <div className={classes.medicineImg}>
              <img src={medicine.image} />
            </div>
            <div className={classes.medicineTitle}>{medicine.name}</div>
          </div>
          <div>
            <div className={classes.medicinePrice}>{medicine.price} L.E.</div>
            <div className={classes.medicineDesc1}>Active Ingredient:</div>
            <div className={classes.medicineDesc2}>{ingredients}</div>
            <div className="d-flex mt-2">
              <div className={`${classes.viewButton} ms-1`}>View</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const onClickSearch = (event) => {
    if (event == null || event.key === 'Enter') {
      setSearchText(sectionSearchText);
      filterMedicine();
      medicineResultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <NavBar />
      <section className={classes.welcomeSection}>
        <div className={`col-5 ${classes.sectionLeftCol}`}>
          <div className={classes.sectionTitle}>
            We can get your Drug Prescription to You
          </div>
          <div className={classes.sectionSubtitle}>
            We have all the drugs your doctor prescribed for your health and
            what's more, we can get it to you.
          </div>
          <div className={classes.searchContainer}>
            <div className={classes.searchIcon}>
              <img width={30} src={searchIconImg} />
            </div>
            <input
              className={classes.searchInput}
              value={sectionSearchText}
              onChange={(e) => setSectionSearchText(e.target.value)}
              onKeyDown={onClickSearch}
              placeholder="Search for a drug"
            />
            <div
              onClick={() => onClickSearch()}
              className={classes.searchButton}
            >
              Search
            </div>
          </div>
        </div>
        <div className="col-7 position-relative">
          <img className={classes.sectionRect} src={sectionRectangleImg} />
          <img
            className={classes.sectionMedicineImg}
            src={sectionMedicineImg}
          />
        </div>
      </section>

      <section className={classes.medicineSection}>
        <div className={classes.medicineSectionTitle}>BROWSE MEDICINE</div>
        <div className={classes.medicineSearchContainer}>
          <div className={classes.medicineSearchIcon}>
            <img width={30} src={searchIconImg} />
          </div>
          <input
            className={classes.medicineSearchInput}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search"
          />
        </div>
        {getCategoryTiles()}
        <div ref={medicineResultsRef} className={classes.divider}>
          <div
            style={{
              flex: '60%',
              backgroundColor: '#1BC768',
              borderRadius: '5px 0 0 5px',
            }}
          />
          <div
            style={{
              flex: '40%',
              backgroundColor: '#86F1E2',
              borderRadius: '5px',
            }}
          />
        </div>
        <div className={classes.resultsContainer}>
          {medicines.map((medicine) => getMedicine(medicine))}
        </div>
      </section>
    </div>
  );
};

export default Homepage;

const categories1 = [
  { img: feverImg, title: 'Fever', index: 0 },
  { img: headacheImg, title: 'Headache', index: 1 },
  { img: eyeImg, title: 'Eyes', index: 2 },
  { img: lungsImg, title: 'Cough', index: 3 },
  { img: nutritionImg, title: 'Nutrition', index: 4 },
];

const categories2 = [
  { img: babyImg, title: 'Baby Products', index: 5 },
  { img: brokenArmImg, title: 'Pain Relief', index: 6 },
  { img: stomachImg, title: 'Stomach', index: 7 },
  { img: insomniaImg, title: 'Insomnia', index: 8 },
  { img: firstaidImg, title: 'First Aid', index: 9 },
];
