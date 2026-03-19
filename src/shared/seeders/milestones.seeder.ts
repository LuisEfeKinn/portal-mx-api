import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { MilestoneRepository } from 'src/announcement/repositories/milestone.repository'

interface MilestoneSeed {
  name: string
  key: string
  description: string
  order: number
}

@Injectable()
export class MilestonesSeeder implements OnModuleInit {
  private readonly logger = new Logger(MilestonesSeeder.name)

  private readonly milestones: MilestoneSeed[] = [
    {
      name: 'Preparación',
      key: 'preparation',
      description:
        'Información descriptiva y recursos para que el aplicante conozca la generalidad del proceso.',
      order: 1,
    },
    {
      name: 'Inscripción y Simulación',
      key: 'registration_simulation',
      description:
        'Etapa de registro: descarga de Sumadi, toma de fotos, escaneo de documento y examen de simulación.',
      order: 2,
    },
    {
      name: 'Aplicación',
      key: 'application',
      description: 'Presentación de la prueba.',
      order: 3,
    },
    {
      name: 'Solicitud de Reaplicación',
      key: 'reapplication_request',
      description:
        'Formulario para aplicantes que no pudieron presentar la prueba por un hecho fortuito válido.',
      order: 4,
    },
    {
      name: 'Cargue de Constancia',
      key: 'certificate_upload',
      description:
        'El aplicante carga su constancia de participación (documento escaneado).',
      order: 5,
    },
    {
      name: 'Certificado / Resultado',
      key: 'certificate_result',
      description: 'Etapa final del proceso. Pendiente de definición.',
      order: 6,
    },
  ]

  constructor(private readonly milestoneRepository: MilestoneRepository) {}

  async onModuleInit() {
    if (process.env.RUN_SEEDERS !== 'true') return
    await this.seed()
  }

  async seed() {
    this.logger.log('Verificando hitos del sistema...')

    for (const data of this.milestones) {
      const existing = await this.milestoneRepository.findOneBy({
        key: data.key,
      })
      if (!existing) {
        await this.milestoneRepository.save(
          this.milestoneRepository.create(data),
        )
        this.logger.log(`Hito creado: ${data.name}`)
      }
    }

    this.logger.log('Hitos verificados correctamente')
  }
}
