import React, { Component } from "react";
import medicinalUseEnum from "../../util/medicinalUseEnum";

class AddMedicineForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      activeIngredients: "",
      price: "",
      sales: "",
      quantity: "",
      image: "",
      medicinalUse: "cold",
    };
  }

  handleNameChange = (event) => {
    this.setState({
      name: event.target.value,
    });
  };

  handleActiveIngredientsChange = (event) => {
    this.setState({
      activeIngredients: event.target.value,
    });
  };

  handlePriceChange = (event) => {
    this.setState({
      price: event.target.value,
    });
  };

  handleSalesChange = (event) => {
    this.setState({
      sales: event.target.value,
    });
  };

  handleQuantityChange = (event) => {
    this.setState({
      quantity: event.target.value,
    });
  };

  handleImageChange = (event) => {
    this.setState({
      image: event.target.value,
    });
  };

  handleMedicinalUseChange = (event) => {
    this.setState({
      medicinalUse: event.target.value,
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(this.state),
    };
    fetch("http://localhost:4000/medicine", requestOptions);
  };

  render() {
    const medicinalUseOptions = []; // fill options based on medicinalUse enum
    for (const use of medicinalUseEnum) {
      medicinalUseOptions.push(<option value={use}>{use}</option>);
    }
    const {
      name,
      activeIngredients,
      price,
      sales,
      quantity,
      image,
      medicinalUse,
    } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={this.handleNameChange} />
        </div>
        <div>
          <label>Active Ingredients</label>
          <input
            type="text"
            value={activeIngredients}
            onChange={this.handleActiveIngredientsChange}
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={this.handlePriceChange}
          />
        </div>
        <div>
          <label>Sales</label>
          <input
            type="number"
            value={sales}
            onChange={this.handleSalesChange}
          />
        </div>
        <div>
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={this.handleQuantityChange}
          />
        </div>
        <div>
          <label>ImageUrl</label>
          <input type="text" value={image} onChange={this.handleImageChange} />
        </div>
        <div>
          <label>Medicinal Use</label>
          <select value={medicinalUse} onChange={this.handleMedicinalUseChange}>
            {medicinalUseOptions}
          </select>
        </div>
        <button type="submit">Add Medicine</button>
      </form>
    );
  }
}

export default AddMedicineForm;
