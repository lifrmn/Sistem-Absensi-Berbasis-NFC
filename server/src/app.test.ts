import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from './app';

describe('API integration', () => {
  it('should login dosen and read attendance report', async () => {
    const loginResponse = await request(app).post('/api/auth/login').send({
      username: 'dosen',
      password: 'Dosen@12345',
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeTruthy();

    const reportResponse = await request(app)
      .get('/api/reports/attendance?course=pemrograman-web')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(reportResponse.status).toBe(200);
    expect(Array.isArray(reportResponse.body.data)).toBe(true);
    expect(reportResponse.body.data.length).toBeGreaterThan(0);
  });

  it('should register and login a new mahasiswa', async () => {
    const suffix = Date.now();
    const username = `user${suffix}`;

    const registerResponse = await request(app).post('/api/auth/register').send({
      nama: `Mahasiswa ${suffix}`,
      idNumber: `M${suffix}`,
      email: `${username}@student.unismuh.ac.id`,
      password: 'Mahasiswa@12345',
      confirmPassword: 'Mahasiswa@12345',
      role: 'mahasiswa',
      username,
    });

    expect(registerResponse.status).toBe(201);

    const loginResponse = await request(app).post('/api/auth/login').send({
      username,
      password: 'Mahasiswa@12345',
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.user.role).toBe('mahasiswa');
  });

  it('should return mahasiswa attendance summary and history', async () => {
    const loginResponse = await request(app).post('/api/auth/login').send({
      username: 'a001',
      password: 'Mahasiswa@12345',
    });

    expect(loginResponse.status).toBe(200);

    const summaryResponse = await request(app)
      .get('/api/attendance/me')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(summaryResponse.status).toBe(200);
    expect(typeof summaryResponse.body.totalHadir).toBe('number');
    expect(typeof summaryResponse.body.persentase).toBe('number');
    expect(Array.isArray(summaryResponse.body.history)).toBe(true);
  });
});
