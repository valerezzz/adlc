function sendWhatsAppReservation(event) {
  event.preventDefault();

  // Récupérer les données du formulaire
  const fullName = document.getElementById("fullName").value.trim();
  const reservationDate = document.getElementById("date-resto").value;
  const reservationTime = document.getElementById("heure-resto").value;
  const guestCount = document.getElementById("guestCount").value;
  const additionalMessage = document
    .getElementById("additionalMessage")
    .value.trim();

  // Validation simple
  if (!fullName || !reservationDate || !reservationTime || !guestCount) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  // Parser le format d/m/Y de flatpickr
  const [day, month, year] = reservationDate.split("/");
  const dateObj = new Date(year, month - 1, day);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = dateObj.toLocaleDateString("fr-FR", options);

  // Créer le message WhatsApp
  const timeOfDay = new Date().getHours() < 18 ? "Bonjour" : "Bonsoir";
  let message = `${timeOfDay}, j'aimerais réserver pour ${guestCount} personne${guestCount > 1 ? "s" : ""} à ${reservationTime} le ${formattedDate} au nom de ${fullName}.`;

  if (additionalMessage) {
    message += `\n\nNota bene: ${additionalMessage}`;
  }

  message += `\n\nCordialement,\n${fullName}`;

  // Encoder le message pour l'URL
  const encodedMessage = encodeURIComponent(message);

  // Numéro WhatsApp (format international)
  const whatsappNumber = "41787334551"; // +41 78 733 45 51

  // Créer l'URL WhatsApp
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  // Ouvrir WhatsApp
  window.open(whatsappUrl, "_blank");

  // Réinitialiser le formulaire après envoi
  setTimeout(() => {
    document.getElementById("whatsappForm").reset();
    alert(
      "Votre demande de réservation a été envoyée via WhatsApp ! Nous vous confirmerons rapidement la disponibilité.",
    );
  }, 1000);
}

function sendHotelReservation(event) {
  event.preventDefault();

  // Récupérer les données du formulaire
  const guestName = document.getElementById("guestName").value.trim();
  const guestEmail = document.getElementById("guestEmail").value.trim();
  const checkInDate = document.getElementById("date-arrivee").value;
  const checkOutDate = document.getElementById("date-depart").value;
  const numberOfGuests = document.getElementById("numberOfGuests").value;
  const roomType = document.getElementById("roomType").value;
  const hotelMessage = document.getElementById("hotelMessage").value.trim();

  // Validation
  if (
    !guestName ||
    !guestEmail ||
    !checkInDate ||
    !checkOutDate ||
    !numberOfGuests ||
    !roomType
  ) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  // Parser le format d/m/Y de flatpickr
  const [inDay, inMonth, inYear] = checkInDate.split("/");
  const [outDay, outMonth, outYear] = checkOutDate.split("/");
  const checkInDateObj = new Date(inYear, inMonth - 1, inDay);
  const checkOutDateObj = new Date(outYear, outMonth - 1, outDay);

  // Vérifier que la date de départ est après la date d'arrivée
  if (checkOutDateObj <= checkInDateObj) {
    alert("La date de départ doit être après la date d'arrivée.");
    return;
  }

  // Formater les dates en français
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedCheckIn = checkInDateObj.toLocaleDateString(
    "fr-FR",
    dateOptions,
  );
  const formattedCheckOut = checkOutDateObj.toLocaleDateString(
    "fr-FR",
    dateOptions,
  );

  // Calculer le nombre de nuits
  const diffTime = Math.abs(checkOutDateObj - checkInDateObj);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Créer le message WhatsApp
  const timeOfDay = new Date().getHours() < 18 ? "Bonjour" : "Bonsoir";
  let message = timeOfDay + ",\n\n";
  message += "Je souhaite réserver une chambre à l'Auberge de Mies - La Couronne\n\n";
  message += "Nom: " + guestName + "\n";
  message += "Email: " + guestEmail + "\n";
  message += "Arrivée: " + formattedCheckIn + "\n";
  message += "Départ: " + formattedCheckOut + "\n";
  message += "Nombre de nuits: " + diffDays + "\n";
  message += "Nombre de personnes: " + numberOfGuests + "\n";
  message += "Type de chambre: " + roomType + "\n";

  if (hotelMessage) {
    message += "\nDemandes spéciales:\n" + hotelMessage + "\n";
  }

  message += "\nMerci de me confirmer la disponibilité et le tarif.\n\n";
  message += "Cordialement,\n" + guestName;

  // Encoder le message pour l'URL
  const encodedMessage = encodeURIComponent(message);

  // Numéro WhatsApp (format international)
  const whatsappNumber = "41787334551"; // +41 78 733 45 51

  // Créer l'URL WhatsApp
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  // Ouvrir WhatsApp
  window.open(whatsappUrl, "_blank");

  setTimeout(() => {
    alert(
      "Votre demande de réservation a été envoyée via WhatsApp ! Nous vous confirmerons rapidement la disponibilité.",
    );
  }, 1000);
}

window.sendWhatsAppReservation = sendWhatsAppReservation;
window.sendHotelReservation = sendHotelReservation;
