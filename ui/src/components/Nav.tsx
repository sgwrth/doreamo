import { Link } from "react-router";

export default function Nav() {
    return (
        <>
            <div>
                <Link to="/"><button>Home</button></Link>
                <Link to="/login"><button>Login</button></Link>
                <Link to="/books"><button>Books</button></Link>
                <Link to="/counter"><button>Counter</button></Link>
            </div>
        </>
    )
}