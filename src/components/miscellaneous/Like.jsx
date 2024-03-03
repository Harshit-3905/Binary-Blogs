import PropTypes from "prop-types";

const LikeContainer = (props) => {
  return (
    <div
      className="heart-container w-5 h-5 relative transition duration-300"
      style={{ "--heart-color": "rgb(255, 91, 137)" }}
    >
      <input
        type="checkbox"
        className="checkbox absolute w-full h-full opacity-0 z-20 cursor-pointer"
        checked={props.liked}
      />
      <div className="svg-container flex justify-center items-center h-full">
        <svg viewBox="0 0 24 24" className="svg-outline fill-current absolute">
          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
        </svg>
        <svg
          viewBox="0 0 24 24"
          className="svg-filled fill-current absolute animate-svg-filled hidden"
        >
          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
        </svg>
        <svg
          className="svg-celebrate stroke-current fill-current absolute animate-svg-celebrate hidden"
          width="100"
          height="100"
        >
          <polygon points="10,10 20,20"></polygon>
          <polygon points="10,50 20,50"></polygon>
          <polygon points="20,80 30,70"></polygon>
          <polygon points="90,10 80,20"></polygon>
          <polygon points="90,50 80,50"></polygon>
          <polygon points="80,80 70,70"></polygon>
        </svg>
      </div>
    </div>
  );
};
LikeContainer.propTypes = {
  liked: PropTypes.bool.isRequired,
};

export default LikeContainer;
