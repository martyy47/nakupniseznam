export const mockUsers = [
  { id: "user-1", name: "Matyáš Novák" },
  { id: "user-2", name: "Jana" },
];

export const mockShoppingLists = [
  {
    id: "list-1",
    name: "Penny - týdenní nákup",
    ownerId: "user-1",
    ownerName: "Matyáš Novák",
    archived: false,
    items: [
      { id: "item-1", text: "Mléko", done: false, addedBy: "user-1" },
      { id: "item-2", text: "Rohlíky", done: true, addedBy: "user-1" },
    ],
  },
  {
    id: "list-2",
    name: "Lidl - párty nákup",
    ownerId: "user-1",
    ownerName: "Matyáš Novák",
    archived: false,
    items: [],
  },
  {
    id: "list-3",
    name: "Billa - starý seznam",
    ownerId: "user-2",
    ownerName: "Jana",
    archived: true,
    items: [{ id: "item-3", text: "Voda", done: false, addedBy: "user-2" }],
  },
];