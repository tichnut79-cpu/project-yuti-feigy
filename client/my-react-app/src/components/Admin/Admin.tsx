import { useEffect, useState } from "react";
import { apiFetch } from "../../Api/ApiFetch";
import  "./Admin.css"
type Medicine = {
  id: string;
  name: string;
};

export default function Admin() {
  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [medicineToDelete, setMedicineToDelete] = useState<string | null>(null);

  // GET all
  const fetchMedicines = async () => {
    const res = await apiFetch("http://localhost:8080/api/Medicines/admin/all");
    if (!res.ok) {
  const text = await res.text();
  console.error(text);
  return;
}
    const data = await res.json();
    setMedicines(data);
  };

  // POST
  const addMedicine = async () => {
  if (!name.trim()) return;

  await apiFetch("http://localhost:8080/api/Medicines/medicine", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

  setName("");
  fetchMedicines();
};

  // DELETE
  const deleteMedicine = async (name: string) => {
    await apiFetch(`http://localhost:8080/api/Medicines/by-name/${name}`, {
      method: "DELETE",
    });

    fetchMedicines();
  };

  useEffect(() => {
    fetchMedicines();
  }, []);
useEffect(() => {
  const fetchData = async () => {
    // אם אין חיפוש → אפשר להביא הכל (או להשאיר ריק)
    if (!search) {
      const res = await apiFetch("http://localhost:8080/api/Medicines/admin/all");
      const data = await res.json();
      setMedicines(data);
      return;
    }

    const res = await apiFetch(
      `http://localhost:8080/api/Medicines?search=${search}`
    );

    if (!res.ok) {
      setMedicines([]);
      return;
    }

    const data = await res.json();
    setMedicines(data); // כי זה מחזיר פריט אחד
  };

  fetchData();
}, [search]);
  return (
    <div className="admin-container">
      <div className="admin-card">
        <h1 className="admin-title">Pharma Admin Dashboard</h1>

        {/* ADD SECTION */}
        <div className="admin-form">
  <input
    className="admin-input"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search medicine..."
  />

  <button
    className="admin-add-btn"
    onClick={() => setShowAddModal(true)}
  >
    + Add Medicine
  </button>
</div>
      </div>

      {/* LIST */}
      <div className="admin-list">
        {medicines.map((m) => (
          <div className="medicine-card" key={m.id}>
            <div className="medicine-name">{m.name}</div>

            <button
                className="delete-btn"
                onClick={() => setMedicineToDelete(m.name)}
                >Delete
            </button>
          </div>
        ))}
      </div>
      {medicineToDelete && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Confirm Deletion</h2>

      <p>
        Are you sure you want to delete{" "}
        <b>{medicineToDelete}</b>?
      </p>

      <div className="modal-actions">
        <button
          className="cancel-btn"
          onClick={() => setMedicineToDelete(null)}
        >
          Cancel
        </button>

        <button
          className="confirm-delete-btn"
          onClick={async () => {
            await deleteMedicine(medicineToDelete);
            setMedicineToDelete(null);
          }}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}
{showAddModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Add New Medicine</h2>

      <input
        className="admin-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Medicine name"
      />

      <div className="modal-actions">
        <button
          className="cancel-btn"
          onClick={() => {
            setShowAddModal(false);
            setName("");
          }}
        >
          Cancel
        </button>

        <button
          className="confirm-delete-btn"
          onClick={async () => {
            await addMedicine();
            setShowAddModal(false);
          }}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>

  );
}