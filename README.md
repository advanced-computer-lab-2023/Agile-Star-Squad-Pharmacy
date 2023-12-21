# Agile Star Squad Pharmacy

## Table of Contents

1. [ Motivation. ](#motivation)
2. [ Code Style. ](#code-style)
3. [ Technologies Used. ](#technology)
4. [ Features. ](#features)
5. [ API Refrences. ](#api-ref)
6. [ Tests. ](#tests)
7. [ Usage. ](#usage)
8. [ Contribution. ](#contribution)
9. [ Contributors. ](#collabs)
10. [ Credits. ](#credits)
11. [ Licenses. ](#licenses)

<a name="motivation"></a>

## Motivation

The Pharmacy Website is a comprehensive web application designed for both pharmacists and customers. This website provides a user-friendly interface for users to explore, order medications, view available pharmaceutical products, and access detailed information about various drugs and their uses. Whether you're a customer seeking medical supplies or a pharmacist looking to streamline your services, this website is your ultimate platform for efficient pharmaceutical management and access.

<a name="code-style"></a>

## Code Style

- The project is divided into 2 main folders the backend and the frontend.
  1. Backend
  - The backend is divided into models, controllers, routes, utils & middleware.
  2. Frontend
  - The frontend is divided into src & public.
  - The src is divided into assets, admin, login, medicines, patient, pharmacist, pharmacy, shared & user-store
  3. Each of the leaf folders mentioned above contains the main files of the project.

<a name="technology"></a>

## Technologies used

- **React**: This project uses React, a JavaScript library for building user interfaces. React's component-based architecture makes it easy to create complex UIs from small, reusable pieces of code. It also provides a virtual DOM to optimize rendering and improve app performance.

- **Node.js and Express**: The backend of this project is built with Node.js, a JavaScript runtime that allows for server-side scripting. Express, a web application framework for Node.js, is used to build the web server and handle HTTP requests.

- **MongoDB and Mongoose**: MongoDB, a NoSQL database, is used to store data in a flexible, JSON-like format. Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. It provides a straightforward, schema-based solution to model application data.

- **JWT for Authentication**: JSON Web Tokens (JWT) are used for securely transmitting information between parties as a JSON object. In this project, JWT is used for handling user authentication and protecting routes.

- **Bootstrap and CSS**: Bootstrap, a popular CSS framework, is used for designing responsive and mobile-first web pages. Custom CSS is also used for additional styling and layout design.

- **Material-UI (MUI)**: This project uses Material-UI, a popular React UI framework that implements Google's Material Design. It provides a set of pre-built React components that follow the best practices of user interface design. With MUI, you can build robust, consistent, and beautiful user interfaces with less effort.

<a name="features"></a>

## Features

### 1. Product Management:

- Browse through a wide range of pharmaceutical products.
- Detailed view of each product.
- Update product information as needed.

### 2. Order Placement:

- Customers can place orders for their required medications.
- View and manage current and past orders.

### 3. Pharmacist Directory:

- View a list of all available pharmacists.
- Access detailed profiles of pharmacists, including their specialization and experience.

### 4. Prescription Management:

- Upload and manage digital prescriptions.
- Pharmacists can view and verify prescriptions.

### 5. User Authentication:

- Secure login system for customers and pharmacists.
- Role-based access control to protect sensitive information.

<a name="api-ref"></a>

## API Refrences

### API Routes

1. `/cart`: This route is used for all cart related operations.

2. `/pharmacy`: This route is used for all pharmacy related operations.

3. `/orders`: This route is used for all order related operations.

4. `/admins`: This route is used for all admin related operations.

5. `/pharmacist`: This route is used for all pharmacist related operations.

6. `/patients`: This route is used for all patient related operations.

7. `/medicine`: This route is used for all medicine related operations.

8. `/address`: This route is used for all address related operations.

9. `/auth`: This route is used for all authentication related operations.

### Address Routes

1. `GET /:patientId`: This route is used to get all addresses associated with a specific patient. The `patientId` is passed as a parameter in the URL.

2. `POST /:patientId`: This route is used to add a new address for a specific patient. The `patientId` is passed as a parameter in the URL, and the address details are passed in the request body.

### Admin Routes

1. `GET /`: This route is used to get all admins.

2. `POST /`: This route is used to create a new admin. The admin details are passed in the request body.

3. `GET /requests`: This route is used to view all requests made by users.

4. `POST /requests`: This route is used to accept a user request. The request details are passed in the request body.

5. `PATCH /requests`: This route is used to reject a user request. The request details are passed in the request body.

6. `GET /orders`: This route is used to get all orders made by users.

7. `GET /:id`: This route is used to get a specific admin. The admin's `id` is passed as a parameter in the URL.

8. `DELETE /:id`: This route is used to remove a specific admin. The admin's `id` is passed as a parameter in the URL.

### Authentication Routes

1. `GET /resetPassword`: This route is used to get an OTP (One Time Password) for password reset.

2. `POST /resetPassword/:email`: This route is used to initiate a password reset for a user. The user's email is passed as a parameter in the URL.

3. `GET /resetPassword/:email`: This route is used to get a user by their email. The user's email is passed as a parameter in the URL.

4. `PATCH /resetPassword/:id`: This route is used to update a user's password. The user's `id` is passed as a parameter in the URL.

5. `GET /:username/:password`: This route is used to log in a user. The user's username and password are passed as parameters in the URL.

6. `GET /logout`: This route is used to log out a user.

7. `GET /me`: This route is used to get the currently logged in user.

### Cart Routes

1. `GET /`: This route is used to get all items in the cart.

2. `POST /`: This route is used to add an item to the cart. The item details are passed in the request body.

3. `PUT /:id`: This route is used to update the quantity of a specific item in the cart. The item's `id` is passed as a parameter in the URL, and the new quantity is passed in the request body.

4. `DELETE /:id`: This route is used to remove a specific item from the cart. The item's `id` is passed as a parameter in the URL.

### Medicine Routes

1. `GET /`: This route is used to get all medicines.

2. `POST /`: This route is used to create a new medicine. The medicine details are passed in the request body. This route requires pharmacist authentication.

3. `PATCH /:id`: This route is used to update a specific medicine. The medicine's `id` is passed as a parameter in the URL, and the updated details are passed in the request body. This route requires pharmacist authentication.

4. `GET /:id`: This route is used to get a specific medicine. The medicine's `id` is passed as a parameter in the URL. This route requires pharmacist authentication.

5. `DELETE /:id`: This route is used to delete a specific medicine. The medicine's `id` is passed as a parameter in the URL. This route requires pharmacist authentication.

6. `PATCH /archive/:id`: This route is used to archive a specific medicine. The medicine's `id` is passed as a parameter in the URL. This route requires pharmacist authentication.

7. `PATCH /unarchive/:id`: This route is used to unarchive a specific medicine. The medicine's `id` is passed as a parameter in the URL. This route requires pharmacist authentication.

### Order Routes

1. `GET /patient/:patientId`: This route is used to get all orders associated with a specific patient. The patient's `id` is passed as a parameter in the URL.

2. `GET /:id`: This route is used to get a specific order. The order's `id` is passed as a parameter in the URL.

3. `DELETE /:id`: This route is used to delete a specific order. The order's `id` is passed as a parameter in the URL.

4. `PUT /:id`: This route is used to change the status of a specific order. The order's `id` is passed as a parameter in the URL, and the new status is passed in the request body.

5. `POST /`: This route is used to add a new order. The order details are passed in the request body.

### Patient Routes

1. `GET /`: This route is used to get all patients.

2. `POST /`: This route is used to sign up a new patient. The patient details are passed in the request body.

3. `GET /:id`: This route is used to get a specific patient. The patient's `id` is passed as a parameter in the URL. This route requires patient authentication.

4. `DELETE /:id`: This route is used to remove a specific patient. The patient's `id` is passed as a parameter in the URL. This route requires admin authentication.

5. `GET /:id/cart`: This route is used to get the cart of a specific patient. The patient's `id` is passed as a parameter in the URL. This route requires patient authentication.

6. `POST /:id/cart`: This route is used to set the cart of a specific patient. The patient's `id` is passed as a parameter in the URL, and the cart details are passed in the request body. This route requires patient authentication.

7. `GET /:id/chat`: This route is used to get the chat of a specific patient. The patient's `id` is passed as a parameter in the URL. This route requires patient authentication.

8. `POST /:patientId/wallet`: This route is used to update the wallet of a specific patient. The patient's `id` is passed as a parameter in the URL, and the wallet details are passed in the request body.

### Pharmacist Routes

1. `GET /:id/chats`: This route is used to get all chats of a specific pharmacist. The pharmacist's `id` is passed as a parameter in the URL.

2. `GET /:id/:doctorId/chats`: This route is used to get the chat between a specific pharmacist and doctor. The pharmacist's `id` and doctor's `id` are passed as parameters in the URL.

3. `GET /`: This route is used to get all pharmacists. This route requires pharmacist authentication.

4. `POST /`: This route is used to sign up a new pharmacist. The pharmacist details are passed in the request body. This route requires pharmacist authentication.

5. `DELETE /:pharmacistId/notifications/:notificationId`: This route is used to delete a specific notification of a specific pharmacist. The pharmacist's `id` and notification's `id` are passed as parameters in the URL. This route requires pharmacist authentication.

6. `GET /:pharmacistId/notifications`: This route is used to get all notifications of a specific pharmacist. The pharmacist's `id` is passed as a parameter in the URL. This route requires pharmacist authentication.

7. `GET /:id`: This route is used to get a specific pharmacist. The pharmacist's `id` is passed as a parameter in the URL. This route requires pharmacist authentication.

8. `PATCH /:id`: This route is used to update a specific pharmacist. The pharmacist's `id` is passed as a parameter in the URL, and the updated details are passed in the request body. This route requires pharmacist authentication.

9. `DELETE /:id`: This route is used to remove a specific pharmacist. The pharmacist's `id` is passed as a parameter in the URL. This route requires pharmacist authentication.

### Pharmacy Routes

1. `GET /`: This route is used to get all medicines.

<a name="tests"></a>

## Tests

To test the API locally, you can use a tool like [Postman](https://www.postman.com/) or [curl](https://curl.se/). The API runs on `http://localhost:3000` by default.

Here are some examples of how to test the different endpoints:

**Postman**

- Get all patients method in backend

```
exports.getAllPatients = catchAsync(async (req, res, next) => {
  const patients = await Patient.find();

  res.status(200).json({
    status: "success",
    data: {
      patients,
    },
  });
});
```

```
GET Request: http://localhost:3000/patients
```

- Signup as a patient method in backend

```
exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body);

  const newPatient = await Patient.create(req.body)
    .then((result) => {
      console.log("New patient created:", result);
      return result; // Forward the result for further processing
    })
    .catch((error) => {
      console.error("Error creating patient:", error.message);
      throw error; // Re-throw the error for further handling
    });

  if (newPatient == null) {
    res.status(404).json({
      status: "fail",
      data: {
        error: "error",
      },
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      patient: newPatient,
    },
  });
});
```

```
POST Request: http://localhost:3000/patients
```

- Delete patient method in backend

```
exports.removePatient = catchAsync(async (req, res, next) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);

  if (!patient) {
    return next(new AppError("No patient found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
```

```
DELETE Request: http://localhost:3000/patients/:id
```

**curl**

- Get all patients

```bash
curl http://localhost:3000/patients
```

- Signup as a patient

```bash
curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' http://
localhost:3000/patients
```

- Delete patient

```bash
curl -X DELETE http://localhost:3000/patients/:id
```

<a name="usage"></a>

## How to Use the Website

1. **Home Page**: Upon visiting the website, you'll land on the home page. Here, you can learn more about the pharmacy and the products it offers.

<img src="https://i.ibb.co/Pmb7LZw/homePage.png" alt="homePage" border="0">

2. **Registration**: If you're a new user, navigate to the "Register" page to create an account. You'll need to provide some basic information like your name, email address, and password.

<img src="https://i.ibb.co/dbjfNwV/regPage.png" alt="regPage" border="0">

- Patient Registration

<img src="https://i.ibb.co/1d0wLDs/patient-Reg.png" alt="patient-Reg" border="0">

- Pharmacist Registration

<img src="https://i.ibb.co/hmPxHRJ/pharmacist-Reg.png" alt="pharmacist-Reg" border="0">

3. **Login**: If you already have an account, click on the "Login" button on the top right of the page. Enter your email address and password to log in.

<img src="https://i.ibb.co/ykFRWQ8/login.png" alt="login" border="0">

4. **Ordering Medications**: Once logged in, you can order medications by navigating to the "Order Medications" page. Select a product, choose a quantity, and click "Order Now".

<img src="https://i.ibb.co/3F3sqFJ/order-Medicine.png" alt="order-Medicine" border="0">

5. **Viewing Orders**: To view your current and past orders, go to the "My Orders" page. Here, you can also track the status of your orders.

<img src="https://i.ibb.co/FxFnf2H/view-Orders.png" alt="view-Orders" border="0">

6. **Prescription Management**: If you're a patient, you can upload and manage your digital prescriptions by going to the "My Prescriptions" page. Here, you can also view the status of your prescriptions.

<img src="https://i.ibb.co/DYv3Ljq/prescriptions.png" alt="prescriptions" border="0">

<a name="contribution"></a>

## Contribution and Installation Guidelines

If you're a developer interested in contributing to the project, you can install it locally and make contributions by following these steps:

1. Fork the repository.
2. Clone your forked repository to your local machine.
3. Open two terminals.
4. In the first terminal, navigate to the backend directory of the project by running `cd backend`. This is where the backend code resides.
5. Run `npm install` to install the necessary backend dependencies.
6. Run `npm start` to start the backend server.
7. In the second terminal, navigate to the frontend directory of the project by running `cd frontend`. This is where the frontend code resides.
8. Run `npm install` to install the necessary frontend dependencies.
9. Run `npm start` to start the frontend development server.
10. Create a new branch for your changes.
11. Make your changes in your branch.
12. Submit a pull request with a detailed description of your changes.

We welcome contributions from the community. Please ensure that your pull request provides a detailed description of the changes you propose.

<a name="collabs"></a>

## Contributors

<div style="display: flex;">

  <a href="https://github.com/youssef-mostafa25" style="margin-right: 20px;">
    <img src="https://github.com/youssef-mostafa25.png" width="100" height="100" alt="Youssef Hossam" style="border-radius: 50%;">
  </a>
  
  <a href="https://github.com/shampooeyes" style="margin-right: 20px;">
  <img src="https://avatars.githubusercontent.com/u/73359211?s=400&u=ed28dd86a82ce49bc138e8a1d24ffa3bf609646d&v=4" width="100" height="100" alt="Kareem El Kadery" style="border-radius: 50%;"/>

  <a href="https://github.com/Habibaelkabbany" style="margin-right: 20px;">
  <img src="https://github.com/Habibaelkabbany.png" width="100" height="100" alt="Habiba El Kabbany" style="border-radius: 50%;">
  </a>

<a href="https://github.com/Assem-Mohamed" style="margin-right: 20px;">
  <img src="https://github.com/Assem-Mohamed.png" width="100" height="100" alt="Assem Mohamed" style="border-radius: 50%;">
  </a >
  
  <a href="https://github.com/mariiamemad" style="margin-right: 20px;">
  <img src="https://github.com/mariiamemad.png" width="100" height="100" alt="Mariam Emad" style="border-radius: 50%;">
  </a >
</div>

<div style="display: flex;">

  <a href="https://github.com/Lasheen2001" style="margin-right: 20px;">
  <img src="https://github.com/Lasheen2001.png" width="100" height="100" alt="Ahmed Lasheen" style="border-radius: 50%;">
  </a >

  <a href="https://github.com/BigMizo" style="margin-right: 20px;">
  <img src="https://github.com/BigMizo.png" width="100" height="100" alt="Ahmed Lasheen" style="border-radius: 50%;">
  </a >
      
  <a href="https://github.com/mariaamashraaf" style="margin-right: 20px;">
  <img src="https://github.com/mariaamashraaf.png" width="100" height="100" alt="Ahmed Lasheen" style="border-radius: 50%;">
  </a >

  <a href="https://github.com/Ahmedmedhat220" style="margin-right: 20px;">
  <img src="https://github.com/Ahmedmedhat220.png" width="100" height="100" alt="Ahmed Lasheen" style="border-radius: 50%;">
  </a >

  <a href="https://github.com/AhmedMosad0" style="margin-right: 20px;">
  <img src="https://github.com/AhmedMosad0.png" width="100" height="100" alt="Ahmed Lasheen" style="border-radius: 50%;">
  </a >

</div>

<a name="credits"></a>

## Credits

This project was made possible with help from the following resources:

- [Code Ninja YouTube Channel](https://www.youtube.com/channel/UCStj-ORBZ7TGK1FwtGAUgbQ)
- [StackOverflow](https://stackoverflow.com/)
- [GitHub Copilot](https://copilot.github.com/)
- [ChatGPT](https://www.openai.com/chatgpt/)

<a name="licenses"></a>

## Licenses

[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
