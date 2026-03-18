import {
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class BlackListToken {
  @PrimaryColumn('varchar')
  token: string

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt?: Date

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  updatedAt?: Date
}
