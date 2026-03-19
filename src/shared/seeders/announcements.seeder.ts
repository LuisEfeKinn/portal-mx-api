import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { AnnouncementRepository } from 'src/announcement/repositories/announcement.repository'

interface AnnouncementSeed {
  key: string
  name: string
  examStartDate: string
  examEndDate?: string
  reapplicationDate: string
}

@Injectable()
export class AnnouncementsSeeder implements OnModuleInit {
  private readonly logger = new Logger(AnnouncementsSeeder.name)

  private readonly announcements: AnnouncementSeed[] = [
    {
      key: 'promotion_directivos_basica',
      name: 'Promoción a categorías con funciones directivas o de supervisión en educación básica',
      examStartDate: '2026-04-18',
      reapplicationDate: '2026-04-26',
    },
    {
      key: 'promotion_horas_basica',
      name: 'Promoción a horas adicionales en educación básica',
      examStartDate: '2026-04-25',
      reapplicationDate: '2026-05-03',
    },
    {
      key: 'promotion_directivos_media_superior',
      name: 'Promoción a cargos con función directiva o de supervisión en educación media superior',
      examStartDate: '2026-05-09',
      reapplicationDate: '2026-05-16',
    },
    {
      key: 'admission_media_superior',
      name: 'Admisión en educación media superior',
      examStartDate: '2026-05-17',
      reapplicationDate: '2026-05-24',
    },
    {
      key: 'admission_basica',
      name: 'Admisión en educación básica',
      examStartDate: '2026-05-16',
      examEndDate: '2026-05-17',
      reapplicationDate: '2026-05-24',
    },
    {
      key: 'promotion_horizontal_basica',
      name: 'Promoción horizontal por niveles con incentivos en educación básica',
      examStartDate: '2026-07-25',
      examEndDate: '2026-07-26',
      reapplicationDate: '2026-08-02',
    },
  ]

  constructor(
    private readonly announcementRepository: AnnouncementRepository,
  ) {}

  async onModuleInit() {
    if (process.env.RUN_SEEDERS !== 'true') return
    await this.seed()
  }

  async seed() {
    this.logger.log('Verificando convocatorias...')

    for (const data of this.announcements) {
      const existing = await this.announcementRepository.findOneBy({
        key: data.key,
      })
      if (!existing) {
        await this.announcementRepository.save(
          this.announcementRepository.create({
            key: data.key,
            name: data.name,
            examStartDate: new Date(data.examStartDate),
            examEndDate: data.examEndDate
              ? new Date(data.examEndDate)
              : undefined,
            reapplicationDate: new Date(data.reapplicationDate),
            isActive: true,
          }),
        )
        this.logger.log(`Convocatoria creada: ${data.name}`)
      }
    }

    this.logger.log('Convocatorias verificadas correctamente')
  }
}
