import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { entity } = await req.json();
    
    if (!entity) {
      return NextResponse.json({ error: 'Entity is required' }, { status: 400 });
    }

    // Resolve the path to the Python script relative to the project root
    const scriptPath = path.resolve(process.cwd(), 'Shield-KYB-System/kyb_audit_cli.py');
    
    // Command to execute the Python script
    const command = `python "${scriptPath}" "${entity}" --format json`;
    
    console.log(`Executing: ${command}`);
    
    const { stdout, stderr } = await execPromise(command);

    if (stderr && !stdout) {
      console.error(`Script error: ${stderr}`);
      return NextResponse.json({ error: 'Failed to run audit script', details: stderr }, { status: 500 });
    }

    // The script prints status messages before the JSON. We need to extract the JSON part.
    // The JSON starts with '{' and ends with '}'.
    const jsonMatch = stdout.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Failed to parse JSON from script output:', stdout);
      return NextResponse.json({ error: 'Failed to parse audit result', output: stdout }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
