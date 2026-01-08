# Issue #24: Set up scheduled backups for HAPImatic project

| Field | Value |
|-------|-------|
| **State** | OPEN |
| **Created** | 2026-01-08T05:45:11Z |
| **Closed** | N/A |
| **Author** | @MattStarfield |
| **Labels** | chore |

---

## Description

## Summary

Set up automated scheduled backups for the HAPImatic project since it is not located in the Docker folder and therefore is not covered by existing backup routines.

## Context

The HAPImatic project resides at `~/projects/hapimatic/` on the Raspberry Pi, outside of the Docker folder structure that is automatically backed up to the Synology NAS. This means:

- Source code changes (before push) are at risk
- Local configuration and data are not protected
- Any work-in-progress could be lost in case of SD card failure

While the project is version controlled with git (GitHub), local uncommitted changes and runtime data directories need backup protection.

## Locations to Include in Backup

| Path | Description |
|------|-------------|
| `~/projects/hapimatic/` | Source code and project files |
| `~/.hapimatic/` | Runtime data, settings, logs |

## Suggested Approaches

### Option 1: rsync to NAS (Recommended)

Add to existing backup script or create new cron job:

```bash
# Add to crontab or backup script
rsync -avz --delete ~/projects/hapimatic/ /mnt/docker/backups/hapimatic/source/
rsync -avz --delete ~/.hapimatic/ /mnt/docker/backups/hapimatic/data/
```

### Option 2: Dedicated backup script

Create `~/scripts/backup-hapimatic.sh` and add to crontab:

```bash
#!/bin/bash
BACKUP_DEST="/mnt/docker/backups/hapimatic"
DATE=$(date +%Y%m%d)

# Backup source
rsync -avz ~/projects/hapimatic/ "$BACKUP_DEST/source/"

# Backup runtime data
rsync -avz ~/.hapimatic/ "$BACKUP_DEST/data/"

# Log backup completion
echo "$(date): HAPImatic backup completed" >> ~/logs/backup.log
```

### Option 3: Include in pi-cleanup.sh or existing maintenance

Extend the existing `~/scripts/pi-cleanup.sh` to include backup tasks, or create a companion `pi-backup.sh` script.

## Acceptance Criteria

- [ ] HAPImatic source code is backed up to NAS on a schedule
- [ ] Runtime data (`~/.hapimatic/`) is backed up
- [ ] Backup runs automatically (cron job or systemd timer)
- [ ] Backup success/failure is logged
- [ ] Document the backup setup in project README or home directory docs

---

## Comments

