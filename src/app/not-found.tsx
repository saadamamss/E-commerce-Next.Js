import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1 className="title">Oops! Page Not Found</h1>
        <p className="description">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="illustration">
          <div className="planet"></div>
          <div className="astronaut"></div>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.5 + 0.5,
              }}
            ></div>
          ))}
        </div>

        <Link className="home-button" href="/">
          <span className="button-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
              />
            </svg>
          </span>
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;


























