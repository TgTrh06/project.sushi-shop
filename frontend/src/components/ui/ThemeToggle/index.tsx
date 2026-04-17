import "./ThemeToggle.css";

export const ThemeToggle = () => {
  return (
    <label className="switch">
      <input type="checkbox" />
      <span className="slider"></span>
    </label>
  );
};
