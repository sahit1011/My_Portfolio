/**
 * Logs a message to a file in the logs directory via API
 * @param message The message to log
 * @param filename The name of the log file
 */
export async function logToFile(message: string, filename: string): Promise<void> {
  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, filename }),
    });
  } catch (error) {
    console.error(`Failed to write to log file: ${error}`);
  }
}

/**
 * Creates a new log file for a specific analysis session
 * @returns The filename of the new log file
 */
export async function createAnalysisLogFile(): Promise<string> {
  try {
    const response = await fetch('/api/log?action=create', {
      method: 'GET',
    });

    const data = await response.json();
    return data.filename;
  } catch (error) {
    console.error(`Failed to create log file: ${error}`);
    // Fallback to a default filename if API call fails
    const date = new Date();
    const timestamp = date.toISOString().replace(/[:.]/g, '-');
    return `analysis_${timestamp}.log`;
  }
}
