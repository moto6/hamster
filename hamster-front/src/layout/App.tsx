import Header from "./Header.tsx";
import Router from "./Router.tsx";
import Footer from "./Footer.tsx";
import Navigation from "./Navigation.tsx";

function App() {
    return (
        <div className={"d-flex"} style={{minHeight: "100vh"}}>
            <aside style={{minHeight: "100vh"}}>
                <Header>
                    <Navigation/>
                </Header>
            </aside>

            <div className={"flex-grow-1 d-flex flex-column"}>
                <main className={"flex-grow-1 p-3"}>
                    <Router/>
                </main>
                <Footer/>
            </div>
        </div>
    );

}

export default App
