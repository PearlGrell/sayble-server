import { Migration } from '@mikro-orm/migrations';

export class Migration20241009071411 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `User` (`id` text not null, `first_name` text not null, `last_name` text not null, `username` text null, `email` text not null, `password` text null, `dob` datetime not null default 1728458050431, `image` text not null, `is_verified` integer not null, `is_logged_in` integer not null, `otp` text not null, `salt` text not null, `temp_password` text not null, `created_at` datetime not null default 1728458050433, `updated_at` datetime not null default 1728458050433, primary key (`id`));');
  }

}
