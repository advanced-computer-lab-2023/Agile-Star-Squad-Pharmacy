import { Link } from "react-router-dom"

const SignupOptions = () => {
    console.log("SignupOptions")
    return <div>
        <div>
        <Link to={"/patient/register"}>Sign up as patient</Link>

        </div>
        <div>
        <Link to={"/pharmacist/register"}>Sign up as Pharmacist</Link>

        </div>
    </div>
}

export default SignupOptions;