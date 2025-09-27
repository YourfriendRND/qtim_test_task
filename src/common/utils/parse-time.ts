export function parseTimeToSeconds(timeString: string): number {
    if (!timeString) {
      throw new Error('Time string is empty');
    }
  
    if (typeof timeString !== 'string') {
      throw new Error(`Invalid time format`);
    }
  
    // Регулярное выражение для разбора строки
    const regex = /^(\d+)([smhdMy])$/;
    const matches = timeString.match(regex);
  
    if (!matches) {
      throw new Error(`Invalid time format: ${timeString}. Expected format like "45s", "20m", "1h", "2d", "3M", "1y"`);
    }
  
    const value = parseInt(matches[1], 10) || 0;
  
    if (!value || isNaN(value)) {
      throw new Error(`Invalid time value: ${matches[1]}`);
    }
  
    const unit = matches[2] || '';
  
    switch (unit) {
        case 's':
            return value;
        case 'm':
            return value * 60;
        case 'h':
            return value * 60 * 60;
        case 'd':
            return value * 60 * 60 * 24;
        case 'M':
            return value * 60 * 60 * 24 * 30;
        case 'y':
            return value * 60 * 60 * 24 * 365;
        default:
            throw new Error(`Unknown time unit: ${unit}`);
    }
}