import db from '../models';
import HakAksesService from './HakAksesService';
import { admin, socket } from '../../app';

class TokenPerangkatService {
  static async simpanToken(data) {
    try {
      const tokenPerangkat = await db.TokenPerangkat.findOne({ where: { id_pengguna: data.id_pengguna } });

      if (tokenPerangkat === null) {
        await db.TokenPerangkat.create(data);
      } else {
        const key = 'token' in data ? 'token' : 'socket' in data ? 'socket' : 'token';

        if (tokenPerangkat[key] !== data[key]) {
          await db.TokenPerangkat.update({
            [key]: data[key]
          }, { where: { id_pengguna: idPengguna } });
        }
      }

      await TokenPerangkatService.subscribeTukang();

      return Promise.resolve({ message: 'Token telah tersimpan' });
    } catch (error) {
      throw error;
    }
  }

  static async simpanSocketId(idPengguna, socketId) {
    try {
      const tokenPerangkat = await db.TokenPerangkat.findOne({ where: { id_pengguna: idPengguna } });

      if (tokenPerangkat === null) {
        await db.TokenPerangkat.create({
          id_pengguna: idPengguna,
          socket: socketId
        });
      } else {
        if (tokenPerangkat.socket !== socket) {
          await db.TokenPerangkat.update({
            socket: socketId
          }, { where: { id_pengguna: idPengguna } });
        }
      }

      return Promise.resolve({ message: 'Token telah tersimpan' });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static async subscribeTukang() {
    try {
      const kodeTukang =  await HakAksesService.getIdHakAksesByKode(1);
      const tukang = await db.Pengguna.findAll({
        where: { id_hak_akses: kodeTukang.id },
        include: [db.TokenPerangkat]
      });

      const tokenTukang = tukang.map(item => {
        const token = item.dataValues.TokenPerangkat;

        if (token !== null) {
          return token.dataValues.token;
        }
      });

      const listToken = tokenTukang.filter(item => {
        if(item !== null) {
          return item;
        }
      });

      await admin.messaging().subscribeToTopic(listToken, 'pesanan');
    } catch (error) {
      throw error;
    }
  }

  static async getTokenByIdPengguna(idPengguna) {
    try {
      const token = await db.TokenPerangkat.findOne({ where: { id_pengguna: idPengguna } });

      return Promise.resolve(token === null ? token : token.dataValues);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default TokenPerangkatService;