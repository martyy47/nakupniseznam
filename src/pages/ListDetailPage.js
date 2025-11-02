// src/pages/ListDetailPage.js
import React, { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const CURRENT_USER_ID = "user-1";

// jednoduchá „databáze“ v paměti
const MOCK_DATA = {
  "list-1": {
    id: "list-1",
    name: "Víkendový nákup",
    owner: { id: "user-1", name: "Petr (Vlastník)" },
    members: [
      { id: "user-2", name: "Jana" },
      { id: "user-3", name: "Karel" },
    ],
    items: [
      { id: "item-1", name: "Mléko", solved: false },
      { id: "item-2", name: "Chleba", solved: true },
      { id: "item-3", name: "Vejce", solved: false },
    ],
  },
};

export default function ListDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const initialList = MOCK_DATA[id];
  const [list, setList] = useState(initialList);
  const [nameInput, setNameInput] = useState(initialList?.name || "");
  const [newItem, setNewItem] = useState("");
  const [filter, setFilter] = useState("pending"); // 'pending' | 'all' | 'solved'
  const [newMember, setNewMember] = useState("");

  if (!list) {
    return (
      <div style={s.shell}><div style={s.card}>
        <p>Seznam nenalezen.</p>
        <Link to="/">← Zpět</Link>
      </div></div>
    );
  }

  const isOwner = list.owner.id === CURRENT_USER_ID;
  const isMember = isOwner || list.members.some((m) => m.id === CURRENT_USER_ID);
  if (!isMember) return <div style={{ padding: 24 }}>K tomuto seznamu nemáš přístup.</div>;

  const filteredItems = useMemo(() => {
    if (filter === "pending") return list.items.filter((i) => !i.solved);
    if (filter === "solved")  return list.items.filter((i) =>  i.solved);
    return list.items;
  }, [list.items, filter]);

  const saveName = () => {
    if (!isOwner) return;
    setList((p) => ({ ...p, name: nameInput }));
  };
  const addItem = () => {
    if (!newItem.trim()) return;
    const item = { id: "item-" + Date.now(), name: newItem.trim(), solved: false };
    setList((p) => ({ ...p, items: [...p.items, item] }));
    setNewItem("");
  };
  const toggleItem = (itemId) => {
    setList((p) => ({
      ...p,
      items: p.items.map((i) => (i.id === itemId ? { ...i, solved: !i.solved } : i)),
    }));
  };
  const removeItem = (itemId) => {
    setList((p) => ({ ...p, items: p.items.filter((i) => i.id !== itemId) }));
  };
  const addMember = () => {
    if (!isOwner || !newMember.trim()) return;
    const m = { id: "user-" + Date.now(), name: newMember.trim() };
    setList((p) => ({ ...p, members: [...p.members, m] }));
    setNewMember("");
  };
  const removeMember = (uid) => {
    if (!isOwner) return;
    setList((p) => ({ ...p, members: p.members.filter((m) => m.id !== uid) }));
  };
  const leaveList = () => {
    if (isOwner) return;
    setList((p) => ({ ...p, members: p.members.filter((m) => m.id !== CURRENT_USER_ID) }));
    nav("/");
  };

  return (
    <div style={s.shell}><div style={s.card}>
      <div style={{ marginBottom: 12 }}>
        <Link to="/">← Zpět</Link>
      </div>

      <h1 style={{ marginTop: 0 }}>Detail nákupního seznamu</h1>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        {isOwner ? (
          <>
            <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} style={s.input} />
            <button onClick={saveName} style={s.primary}>Uložit název</button>
          </>
        ) : (
          <h2 style={{ margin: 0 }}>{list.name}</h2>
        )}
      </div>

      <div style={{ marginBottom: 8 }}>
        <div><strong>Vlastník:</strong> {list.owner.name}</div>
        <div style={{ marginTop: 6 }}>
          <strong>Členové:</strong> {list.members.length ? list.members.map((m) => m.name).join(", ") : "—"}
        </div>

        {isOwner ? (
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <input
              placeholder="Přidat člena (jméno)"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              style={s.input}
            />
            <button onClick={addMember}>Přidat</button>
          </div>
        ) : (
          <div style={{ marginTop: 8 }}>
            <button onClick={leaveList} style={s.danger}>Opustit seznam</button>
          </div>
        )}

        {isOwner && list.members.length > 0 && (
          <div style={{ marginTop: 6 }}>
            {list.members.map((m) => (
              <span key={m.id} style={s.chip}>
                {m.name}
                <button onClick={() => removeMember(m.id)} style={s.chipBtn}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong>Položky</strong>
          <div>
            <button onClick={() => setFilter("pending")} disabled={filter === "pending"}>Jen nevyřešené</button>{" "}
            <button onClick={() => setFilter("all")}     disabled={filter === "all"}>Vše</button>{" "}
            <button onClick={() => setFilter("solved")}  disabled={filter === "solved"}>Jen vyřešené</button>
          </div>
        </div>

        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {filteredItems.length === 0 && <li style={{ color: "#666" }}>Žádné položky.</li>}
          {filteredItems.map((it) => (
            <li key={it.id} style={s.itemRow}>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" checked={it.solved} onChange={() => toggleItem(it.id)} />
                <span style={it.solved ? { textDecoration: "line-through", color: "#888" } : {}}>
                  {it.name}
                </span>
              </label>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => {
                    const v = prompt("Nový název položky:", it.name);
                    if (v && v.trim()) {
                      const name = v.trim();
                      setList((p) => ({
                        ...p,
                        items: p.items.map((x) => (x.id === it.id ? { ...x, name } : x)),
                      }));
                    }
                  }}
                >✏️</button>
                <button onClick={() => removeItem(it.id)} style={s.dangerSmall}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            placeholder="Nová položka…"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            style={{ ...s.input, flex: 1 }}
          />
          <button onClick={addItem} style={s.primary}>Přidat</button>
        </div>
      </div>
    </div></div>
  );
}

const s = {
  shell: { minHeight: "100vh", background: "#a8a8a8", display: "flex", justifyContent: "center", padding: 16 },
  card: { width: 360, background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 4px 18px rgba(0,0,0,.12)" },
  input: { border: "1px solid #ddd", borderRadius: 8, padding: "8px 10px", outline: "none" },
  primary: { background: "#62b4ff", color: "#fff", border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer" },
  danger: { background: "#ff6666", color: "#fff", border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer" },
  dangerSmall: { background: "#ffd6d6", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer" },
  chip: { display: "inline-flex", alignItems: "center", gap: 6, background: "#f3f3f3", borderRadius: 999, padding: "4px 8px", marginRight: 6, marginTop: 6 },
  chipBtn: { border: "none", background: "transparent", cursor: "pointer", fontWeight: "bold" },
  itemRow: { display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #eee", padding: "6px 0" },
};
