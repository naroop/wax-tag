export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInMinutes <= 0) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    if (diffInMinutes === 1) return '1 minute ago';
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    if (diffInHours === 1) return '1 hour ago';
    return `${diffInHours} hours ago`;
  } else {
    const options: Intl.DateTimeFormatOptions = {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  }
};

export interface DaySortedEntry<T> {
  day: string;
  entries: T[];
}

export const groupByDay = <T extends { created: string }>(records: T[]): DaySortedEntry<T>[] => {
  const grouped = records.reduce(
    (acc, record) => {
      // Extract the day using toLocaleDateString for correct locale formatting
      const day = new Date(record.created).toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(record);
      return acc;
    },
    {} as Record<string, T[]>
  );

  return Object.entries(grouped).map(([day, entries]) => ({
    day,
    entries
  }));
};

export const formatToLongDate = (date: Date): string => {
  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();

  if (isToday) {
    return 'Today';
  }

  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  const datePart = new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  }).format(date);

  return `${weekday} ${datePart}`;
};
