const { createContext, useState } = require('react');

const UserContext = createContext({
  role: 'guest',
  id: null,
  login: (user) => {},
  logout: () => {},
});

export default UserContext;

export const UserContextProvider = (props) => {
  const [user, setUser] = useState({ role: 'guest', userId: null });

  const login = (user) => {
    setUser({ role: user.role, userId: user.userId });
  };

  const logout = () => {
    setUser({ role: 'guest', id: null });
  };

  return (
    <UserContext.Provider
      value={{
        role: user.role,
        userId: user.userId,
        login: login,
        logout: logout,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
