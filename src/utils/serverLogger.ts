// Server-side analysis logging.
//
// Replaces the old src/utils/logger.ts, which called fetch('/api/log') with a
// relative URL. That works in a browser but throws
// `TypeError: Failed to parse URL from /api/log` under Node, so every log write
// from the server-side analyzer silently failed.
//
// Two constraints shape this file:
//  1. Serverless filesystems are read-only apart from the temp dir, so writes go
//     to os.tmpdir() in production and never throw on failure — logging must not
//     be able to take a request down.
//  2. Log filenames arrive in request bodies, so only a strict basename is
//     accepted; a caller must not be able to escape the log directory.
import fs from 'fs';
import os from 'os';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

// process.cwd() is writable in local dev; on a serverless host it is not.
const logsDir = isProduction
  ? path.join(os.tmpdir(), 'portfolio-analysis-logs')
  : path.join(process.cwd(), 'logs');

const SAFE_LOG_FILENAME = /^[A-Za-z0-9._-]+\.log$/;

/** Creates the log directory. Returns false instead of throwing on failure. */
function ensureLogsDir(): boolean {
  try {
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    return true;
  } catch (error) {
    console.error(`Log directory unavailable (${logsDir}): ${error}`);
    return false;
  }
}

/**
 * Resolves a caller-supplied filename to an absolute path inside logsDir.
 * Returns null when the name is anything other than a safe basename.
 */
export function resolveLogPath(filename: string): string | null {
  if (typeof filename !== 'string' || filename.length === 0) return null;
  if (filename !== path.basename(filename)) return null;
  if (!SAFE_LOG_FILENAME.test(filename)) return null;

  const resolved = path.join(logsDir, filename);
  if (!resolved.startsWith(logsDir + path.sep)) return null;
  return resolved;
}

function defaultLogFilename(): string {
  const d = new Date();
  const p = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.log`;
}

/**
 * Appends a timestamped line. Returns false if the filename was rejected or the
 * write failed; callers treat logging as best-effort.
 */
export function appendLog(message: string, filename?: string): boolean {
  const target = resolveLogPath(filename || defaultLogFilename());
  if (!target || !ensureLogsDir()) return false;

  try {
    fs.appendFileSync(target, `[${new Date().toISOString()}] ${message}\n`);
    return true;
  } catch (error) {
    console.error(`Failed to append log: ${error}`);
    return false;
  }
}

/** Same signature as the old client logger, so call sites stay unchanged. */
export async function logToFile(message: string, filename: string): Promise<void> {
  appendLog(message, filename);
}

/**
 * Verbose payload logging (full prompts, raw model output, generated resume
 * text). Skipped in production: those payloads embed the owner's resume and
 * contact details plus whatever job description a visitor pasted, and there is
 * no reason to retain that on a public deployment.
 */
export async function logVerbose(message: string, filename: string): Promise<void> {
  if (isProduction) return;
  appendLog(message, filename);
}

/** Creates a fresh analysis log file and returns its basename. */
export async function createAnalysisLogFile(): Promise<string> {
  const d = new Date();
  const p = (n: number) => n.toString().padStart(2, '0');
  const stamp =
    `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}` +
    `_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  const filename = `analysis_${stamp}.log`;

  const target = resolveLogPath(filename);
  if (target && ensureLogsDir()) {
    try {
      fs.writeFileSync(target, `=== AI RESUME MATCH ANALYSIS LOG - ${d.toLocaleString()} ===\n\n`);
    } catch (error) {
      console.error(`Failed to create log file: ${error}`);
    }
  }

  return filename;
}

/** Reads a log file. Returns null for an unsafe name or a missing file. */
export function readLogFile(filename: string): string | null {
  const target = resolveLogPath(filename);
  if (!target) return null;
  try {
    if (!fs.existsSync(target)) return null;
    return fs.readFileSync(target, 'utf-8');
  } catch (error) {
    console.error(`Failed to read log file: ${error}`);
    return null;
  }
}

export function listLogFiles(): Array<{ name: string; path: string; created: Date }> {
  if (!ensureLogsDir()) return [];
  try {
    return fs
      .readdirSync(logsDir)
      .filter((file) => file.endsWith('.log'))
      .map((file) => ({
        name: file,
        path: `/api/logs?file=${encodeURIComponent(file)}`,
        created: fs.statSync(path.join(logsDir, file)).birthtime,
      }))
      .sort((a, b) => b.created.getTime() - a.created.getTime());
  } catch (error) {
    console.error(`Failed to list log files: ${error}`);
    return [];
  }
}
