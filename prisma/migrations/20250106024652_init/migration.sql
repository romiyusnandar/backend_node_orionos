-- DropForeignKey
ALTER TABLE `sociallink` DROP FOREIGN KEY `SocialLink_userId_fkey`;

-- AddForeignKey
ALTER TABLE `SocialLink` ADD CONSTRAINT `SocialLink_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
