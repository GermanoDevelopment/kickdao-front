import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";

const App: React.FC = () => {
  return (
    <Router>
      {/* TODO: create an animated component for loading page */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          { routes.map((route, index) => {
            return <Route
            key={ `route-${index}` }
            path={ route.path }
            element={
              route.layout ? (
                <route.layout>
                  <route.component />
                </route.layout>
              ) : (
                <route.component />
              )
            }
            />
          }) }
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App;
