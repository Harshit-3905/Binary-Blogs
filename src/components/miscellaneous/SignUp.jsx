const SignUp = () => {
  return (
    <div className="h-full w-full flex items-center justify-center bg-blue-400">
      <form className="flex flex-col w-[70%]">
        <label htmlFor="name">Enter Full Name :</label>
        <input
          type="teact"
          name="name"
          id="name"
          placeholder="Enter your Email"
        />
        <label htmlFor="email">Email :</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your Email"
        />
        <label htmlFor="password">Password :</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your Password"
        />
        <button
          className="p-2 mt-[10] bg-green-700 w-[100px] rounded-3xl"
          type="submit"
        >
          SignUp
        </button>
      </form>
    </div>
  );
};

export default SignUp;
