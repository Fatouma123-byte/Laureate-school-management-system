// Calcule le lundi de la semaine de travail en cours
const currentWorkWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const startOfWeek = new Date(today);

  if (dayOfWeek === 0) {
    startOfWeek.setDate(today.getDate() + 1); // Si c'est dimanche, on passe au lundi suivant
  } else if (dayOfWeek === 6) {
    startOfWeek.setDate(today.getDate() + 2); // Si c'est samedi, on passe au lundi suivant
  } else {
    startOfWeek.setDate(today.getDate() - (dayOfWeek - 1)); // On retrouve le lundi de la semaine en cours
  }
  startOfWeek.setHours(0, 0, 0, 0);

  return startOfWeek;
};

// Dictionnaire pour lier le jour textuel de Prisma au décalage de jours par rapport au Lundi
const daysMap: { [key: string]: number } = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
};

// Ajuste les leçons de la base de données pour les positionner correctement sur la semaine en cours
export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date; end: Date; day: string }[]
): { title: string; start: Date; end: Date }[] => {
  const startOfWeek = currentWorkWeek();

  return lessons.map((lesson) => {
    // 1. Récupération du décalage de jours (Lundi = 0, Mardi = 1, etc.)
    const daysFromMonday = daysMap[lesson.day.toUpperCase()] ?? 0;

    // 2. Initialisation de la date au jour correspondant de la semaine en cours
    const adjustedStartDate = new Date(startOfWeek);
    adjustedStartDate.setDate(startOfWeek.getDate() + daysFromMonday);
    
    // 3. Récupération des heures locales
    let hoursStart = lesson.start.getHours();
    let hoursEnd = lesson.end.getHours();

    // 4. Si les heures du seed sont de nuit (ex: 21h), on retire 12h pour les afficher en journée (ex: 9h)
    if (hoursStart >= 17) { 
      hoursStart -= 12;
      hoursEnd -= 12;
    }

    // 5. Application des heures et minutes ajustées
    adjustedStartDate.setHours(hoursStart, lesson.start.getMinutes(), 0, 0);

    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedEndDate.setHours(hoursEnd, lesson.end.getMinutes(), 0, 0);

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};