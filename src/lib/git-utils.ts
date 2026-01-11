import { execSync } from 'child_process';
import path from 'path';

/**
 * Get the last commit date for a specific file using git
 * @param filePath - Absolute path to the file
 * @returns ISO 8601 date string or null if unavailable
 */
export function getLastCommitDate(filePath: string): string | null {
  try {
    // Use git log to get last commit date in ISO 8601 format
    const command = `git log -1 --format=%cI -- "${filePath}"`;
    const output = execSync(command, {
      encoding: 'utf-8',
      cwd: path.dirname(filePath),
    }).trim();

    return output || null;
  } catch (error) {
    // Git not available or file never committed
    console.warn(`Could not get git date for ${filePath}:`, error);
    return null;
  }
}
