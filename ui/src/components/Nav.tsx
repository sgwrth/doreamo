import { Link } from "react-router";

export default function Nav() {
    return (
        <>
            <div>
                <Link to="/"><button>Home</button></Link>
                <Link to="/books"><button>Books</button></Link>
            </div>
        </>
    )
}