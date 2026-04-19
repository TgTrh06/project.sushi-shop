import { useState } from "react";

export default function ReservePage() {
  const [form, setForm] = useState({
    name: "",
    people: "",
    time: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking:", form);

    alert("Booking successful!");
  };

  return (
    <div className="page-container">
      <section className="reserve-section">
        <h2>Book Your Table</h2>
        <p>Reserve your seat before coming</p>

        <form className="reserve-form" onSubmit={handleSubmit}>
          <div className="reserve-form__group">
            <label className="reserve-form__label">Your Name</label>
            <input
              className="reserve-form__input"
              placeholder="Nguyen Van A"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="reserve-form__group">
            <label className="reserve-form__label">Number of people</label>
            <input
              className="reserve-form__input"
              type="number"
              placeholder="2"
              value={form.people}
              onChange={(e) => setForm({ ...form, people: e.target.value })}
            />
          </div>

          <div className="reserve-form__group">
            <label className="reserve-form__label">Date & Time</label>
            <input
              className="reserve-form__input"
              type="datetime-local"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </div>

          <button className="reserve-form__button" type="submit">
            Book Now
          </button>
        </form>
      </section>
    </div>
  );
}
