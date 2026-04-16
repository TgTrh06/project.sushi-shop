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
      <section className="subscription flex-center">
        <h2>Book Your Table</h2>
        <p>Reserve your seat before coming</p>

        <form className="subscription__form" onSubmit={handleSubmit}>
          <input
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Number of people"
            value={form.people}
            onChange={(e) => setForm({ ...form, people: e.target.value })}
          />

          <input
            type="datetime-local"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />

          <button type="submit">Book Now</button>
        </form>
      </section>
    </div>
  );
}
