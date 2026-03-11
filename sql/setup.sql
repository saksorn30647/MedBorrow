-- ================================================
-- MedBorrow Database Setup v2
-- Plain text passwords (easy to test & understand)
-- ================================================

DROP DATABASE IF EXISTS medborrow;
CREATE DATABASE medborrow;
USE medborrow;

-- ── TABLE: users ─────────────────────────────────
CREATE TABLE users (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  username   VARCHAR(50)  UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  full_name  VARCHAR(100),
  role       ENUM('staff','admin') DEFAULT 'staff',
  ward       VARCHAR(50),
  created_at DATETIME DEFAULT NOW()
);

-- ── TABLE: equipment ─────────────────────────────
CREATE TABLE equipment (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(100) NOT NULL,
  description   TEXT,
  image_url     VARCHAR(255),
  total_qty     INT NOT NULL DEFAULT 0,
  available_qty INT NOT NULL DEFAULT 0,
  category      VARCHAR(50),
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    DATETIME DEFAULT NOW()
);

-- ── TABLE: borrow_requests ───────────────────────
CREATE TABLE borrow_requests (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  request_no    VARCHAR(20) UNIQUE,
  user_id       INT NOT NULL,
  equipment_id  INT NOT NULL,
  qty           INT NOT NULL DEFAULT 1,
  ward          VARCHAR(50),
  borrow_date   DATE NOT NULL,
  return_date   DATE NOT NULL,
  actual_return DATE,
  status        ENUM('pending','approved','rejected','returned','overdue') DEFAULT 'pending',
  note          TEXT,
  approved_by   INT,
  approved_at   DATETIME,
  created_at    DATETIME DEFAULT NOW(),
  FOREIGN KEY (user_id)      REFERENCES users(id),
  FOREIGN KEY (equipment_id) REFERENCES equipment(id),
  FOREIGN KEY (approved_by)  REFERENCES users(id)
);

-- ── SEED: Users (plain text passwords) ──────────
INSERT INTO users (username, password, full_name, role, ward) VALUES
('nurse01', '1234',     'Sarah Johnson',  'staff', 'ICU'),
('nurse02', '1234',     'Mike Chen',      'staff', 'OPD'),
('admin01', 'admin123', 'Dr. Linda Park', 'admin', NULL);

-- ── SEED: Equipment ──────────────────────────────
INSERT INTO equipment (name, description, total_qty, available_qty, category) VALUES
('Blood Pressure Monitor', 'Digital automatic BP monitor',              8,  8,  'Monitoring'),
('Patient Monitor',        'Continuous vital signs monitoring',          5,  3,  'Monitoring'),
('ECG Machine',            '12-lead Electrocardiogram',                 3,  2,  'Diagnostic'),
('Infusion Pump',          'Controlled IV fluid delivery pump',         4,  0,  'Treatment'),
('Portable Ventilator',    'Portable mechanical ventilator',            2,  1,  'Life Support'),
('Glucometer',             'Blood glucose measurement device',         15, 12,  'Monitoring'),
('Ultrasound Machine',     'Diagnostic ultrasound imaging device',      4,  4,  'Diagnostic'),
('Stethoscope',            'Acoustic medical device for auscultation', 10, 10,  'Diagnostic');
