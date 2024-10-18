import fs from 'fs';
import path from 'path';

// Log message to file
export const logToFile = (message: string): void => {
  const logPath = path.join(__dirname, '../../logs', 'app.log');
  fs.appendFileSync(logPath, `${new Date().toISOString()} - ${message}\n`);
};
