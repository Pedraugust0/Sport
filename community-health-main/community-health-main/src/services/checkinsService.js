// CRUD DE CHECK-INS

export function createCheckin(checkinData) {
  const checkins = JSON.parse(localStorage.getItem("checkins")) || [];

  const newCheckin = {
    id: Date.now(),
    date: new Date().toISOString(),
    ...checkinData,
  };

  checkins.push(newCheckin);
  localStorage.setItem("checkins", JSON.stringify(checkins));

  return newCheckin;
}

export function getCheckins() {
  return JSON.parse(localStorage.getItem("checkins")) || [];
}

export function getCheckinsByGroup(groupId) {
  const checkins = JSON.parse(localStorage.getItem("checkins")) || [];
  return checkins.filter(c => c.groupId == groupId);
}

export function deleteCheckin(id) {
  let checkins = JSON.parse(localStorage.getItem("checkins")) || [];

  checkins = checkins.filter(c => c.id !== id);
  localStorage.setItem("checkins", JSON.stringify(checkins));
  return true;
}
