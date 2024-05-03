import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
  };

  componentDidCatch(error, errorInfo) {
    // Handle the error, e.g., log it or show a user-friendly message
    this.setState({ hasError: true, error });
    console.log("User Faced Error Page:", error);
  }

  render() {
    if (this.state.hasError) {
      // Render a fallback UI
      return (
        <div className="justify-center flex h-screen bg-blue-100">
        <div className="w-[80vh] justify-center text-center container bg-white ">
          <div className='flex h-12 bg-[#002772] text-white justify-center text-center items-center'>Attendance Marking System</div>
          <img
            src="/error_img.jpg"
            alt="Error Illustration"
            className="w-60 h-60 mb-8 mx-auto mt-20"
        />
        <h1 className="text-2xl text-center font-bold mb-4">Oops! Something went wrong.</h1>
        <p className="text-gray-600 text-center">
            Please Refresh the page or <a href='/' className='text-blue-500'>Go to Home</a>.
        </p>
        <p className="text-gray-600 text-center mx-14 mt-10">
            If the problem persists, please contact the developers.
        </p>
        </div>
      </div>);
    }

    return this.props.children;
  }
}

export default ErrorBoundary;