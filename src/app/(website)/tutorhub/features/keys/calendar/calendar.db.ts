'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth'; // Adjust import path based on your auth setup
import crypto from 'crypto';


// Encryption helpers
const ENCRYPTION_KEY = process.env.SERVICE_ENCRYPTION_KEY || 'your-32-character-secret-key-here'; // Should be 32 characters
const ALGORITHM = 'aes-256-cbc';

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = textParts.join(':');
  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export interface CalendarKeyData {
  apiKey: string;
  calendarId: string;
}

async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }
  return session.user.id;
}

export async function getCalendarKey(): Promise<CalendarKeyData | null> {
  try {
    const userId = await getCurrentUser();
    
    const serviceKey = await prisma.serviceKey.findUnique({
      where: {
        userId_service: {
          userId,
          service: 'calendar'
        }
      }
    });

    if (!serviceKey) {
      return null;
    }

    const keys = serviceKey.keys as any;
    return {
      apiKey: decrypt(keys.apiKey),
      calendarId: decrypt(keys.calendarId),
    };
  } catch (error) {
    console.error('Error fetching calendar key:', error);
    throw new Error('Failed to retrieve calendar credentials');
  }
}

export async function saveCalendarKey(data: CalendarKeyData): Promise<void> {
  try {
    const userId = await getCurrentUser();
    
    const encryptedKeys = {
      apiKey: encrypt(data.apiKey),
      calendarId: encrypt(data.calendarId),
    };

    const metadata = {
      lastUpdated: new Date().toISOString(),
      service: 'Google Calendar API'
    };

    await prisma.serviceKey.upsert({
      where: {
        userId_service: {
          userId,
          service: 'calendar'
        }
      },
      update: {
        keys: encryptedKeys,
        metadata,
        updatedAt: new Date(),
      },
      create: {
        userId,
        service: 'calendar',
        keys: encryptedKeys,
        metadata,
      },
    });

    // Revalidate any pages that might depend on this data
    revalidatePath('/');
  } catch (error) {
    console.error('Error saving calendar key:', error);
    throw new Error('Failed to save calendar credentials');
  }
}

// Get any service key for the current user
export async function getServiceKey(service: string): Promise<any | null> {
  try {
    const userId = await getCurrentUser();
    
    const serviceKey = await prisma.serviceKey.findUnique({
      where: {
        userId_service: {
          userId,
          service
        }
      }
    });

    if (!serviceKey) {
      return null;
    }

    // Decrypt all keys in the JSON object
    const keys = serviceKey.keys as any;
    const decryptedKeys: any = {};
    
    for (const [key, value] of Object.entries(keys)) {
      if (typeof value === 'string') {
        decryptedKeys[key] = decrypt(value);
      } else {
        decryptedKeys[key] = value;
      }
    }

    return {
      ...decryptedKeys,
      metadata: serviceKey.metadata
    };
  } catch (error) {
    console.error('Error fetching service key:', error);
    throw new Error(`Failed to retrieve ${service} credentials`);
  }
}

// Save any service key for the current user
export async function saveServiceKey(service: string, keys: Record<string, any>, metadata?: any): Promise<void> {
  try {
    const userId = await getCurrentUser();
    
    // Encrypt all string values in the keys object
    const encryptedKeys: any = {};
    for (const [key, value] of Object.entries(keys)) {
      if (typeof value === 'string') {
        encryptedKeys[key] = encrypt(value);
      } else {
        encryptedKeys[key] = value;
      }
    }

    const serviceMetadata = {
      ...metadata,
      lastUpdated: new Date().toISOString(),
      service: service
    };

    await prisma.serviceKey.upsert({
      where: {
        userId_service: {
          userId,
          service
        }
      },
      update: {
        keys: encryptedKeys,
        metadata: serviceMetadata,
        updatedAt: new Date(),
      },
      create: {
        userId,
        service,
        keys: encryptedKeys,
        metadata: serviceMetadata,
      },
    });

    revalidatePath('/');
  } catch (error) {
    console.error('Error saving service key:', error);
    throw new Error(`Failed to save ${service} credentials`);
  }
}

// Delete a service key for the current user
export async function deleteServiceKey(service: string): Promise<void> {
  try {
    const userId = await getCurrentUser();
    
    await prisma.serviceKey.delete({
      where: {
        userId_service: {
          userId,
          service
        }
      }
    });
    
    revalidatePath('/');
  } catch (error) {
    console.error('Error deleting service key:', error);
    throw new Error(`Failed to delete ${service} credentials`);
  }
}

// Get all service keys for the current user
export async function getAllServiceKeys(): Promise<Array<{ service: string; hasKeys: boolean; metadata?: any }>> {
  try {
    const userId = await getCurrentUser();
    
    const serviceKeys = await prisma.serviceKey.findMany({
      where: { userId },
      select: {
        service: true,
        metadata: true,
        updatedAt: true
      }
    });

    return serviceKeys.map(key => ({
      service: key.service,
      hasKeys: true,
      metadata: key.metadata,
      updatedAt: key.updatedAt
    }));
  } catch (error) {
    console.error('Error fetching service keys:', error);
    throw new Error('Failed to retrieve service keys');
  }
}