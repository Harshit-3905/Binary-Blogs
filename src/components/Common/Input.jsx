import PropTypes from "prop-types";

const Input = ({
  type = "text",
  name,
  id,
  placeholder,
  className = "",
  ...props
}) => {
  return (
    <input
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      className={`mt-2 rounded-2xl p-2 ${className}`}
      {...props}
    />
  );
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default Input;
