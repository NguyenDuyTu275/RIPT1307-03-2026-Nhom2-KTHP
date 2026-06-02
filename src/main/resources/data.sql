-- ==========================================
-- 1. USERS (20 bản ghi)
-- ==========================================
INSERT INTO users (id, username, password, email, name) VALUES
(1,  'testuser',    '$2a$10$BMMA3GiD.gOT8V.Akg4Y6u6M1YqH7RGFnjfWAbz1j1TDVoOpDl7sK', 'test@test.com',        'Người Dùng Thử'),
(2,  'duytu',       '1234',               'tu@gmail.com',         'Duy Tú'),
(3,  'user3',       'password321',        'user3@ptit.edu.vn',    'Sinh Viên PTIT'),
(4,  'hoangnam',    'nam_hoang99',        'nam.h@gmail.com',      'Hoàng Nam'),
(5,  'minhthu',     'thu_minh123',        'thu.m@outlook.com',    'Minh Thư'),
(6,  'anhquan',     'quan_anh_pro',       'quan.a@yahoo.com',     'Anh Quân'),
(7,  'khanhly',     'ly_khanh_ptit',      'ly.k@gmail.com',       'Khánh Ly'),
(8,  'quocanh',     'anh_quoc_dev',       'anh.q@gmail.com',      'Quốc Anh'),
(9,  'thanhthao',   'thao_thanh_9x',      'thao.t@gmail.com',     'Thanh Thảo'),
(10, 'duykhuong',   'khuong_duy_it',      'khuong.d@ptit.vn',     'Duy Khương'),
(11, 'bichngoc',    'ngoc_bich_cute',     'ngoc.b@gmail.com',     'Bích Ngọc'),
(12, 'tuanhung',    'hung_tuan_live',     'hung.t@gmail.com',     'Tuấn Hùng'),
(13, 'lanhuong',    'huong_lan_2026',     'huong.l@gmail.com',    'Lan Hương'),
(14, 'vietbach',    'bach_viet_code',     'bach.v@gmail.com',     'Việt Bách'),
(15, 'ngocmai',     'mai_ngoc_123',       'mai.n@gmail.com',      'Ngọc Mai'),
(16, 'dangkhoa',    'khoa_dang_it',       'khoa.d@gmail.com',     'Đăng Khoa'),
(17, 'phuonglinh',  'linh_phuong_dev',    'linh.p@gmail.com',     'Phương Linh'),
(18, 'trungkien',   'kien_trung_99',      'kien.t@gmail.com',     'Trung Kiên'),
(19, 'honghanh',    'hanh_hong_2k',       'hanh.h@gmail.com',     'Hồng Hạnh'),
(20, 'giahuy',      'huy_gia_pro',        'huy.g@gmail.com',      'Gia Huy')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 2. HOTELS (13 bản ghi)
-- ==========================================
INSERT INTO hotels (id, name, address, city, description, rating_avg, status, created_at) VALUES
(1,  'Lucien Hanoi Lakeside Rooftop & Bar', '02 Alley Cau Go',   'Hà Nội', 'Khách sạn sang trọng với rooftop bar nhìn ra Hồ Hoàn Kiếm, không gian hiện đại và tinh tế.', 4.8, 'ACTIVE', NOW()),
(2,  'Solare De Monte Hotel & Spa',         '23-25 Nguyen Sieu', 'Hà Nội', 'Khách sạn boutique kết hợp spa cao cấp, thiết kế tinh tế giữa lòng phố cổ Hà Nội.', 4.7, 'ACTIVE', NOW()),
(3,  'Hanoi Emerald Waters Hotel & Spa',    '47 Lo Su',          'Hà Nội', 'Không gian xanh mướt, dịch vụ spa đẳng cấp tại trung tâm phố cổ Hà Nội.', 4.6, 'ACTIVE', NOW()),
(4,  'Hotel Emerald Waters Classy',         '27-29 Gia Ngu',     'Hà Nội', 'Phong cách lịch lãm, sang trọng với đầy đủ tiện nghi hiện đại tại phố cổ.', 4.5, 'ACTIVE', NOW()),
(5,  'Hanoi Emerald Waters Hotel Valley',   '22 Lo Su',          'Hà Nội', 'Ốc đảo yên tĩnh giữa lòng thành phố, lý tưởng cho kỳ nghỉ thư giãn.', 4.5, 'ACTIVE', NOW()),
(6,  'Hanoi Dalvostro Valentino Hotel',     '12 Bao Khanh',      'Hà Nội', 'Phong cách Ý thanh lịch, kết hợp hoàn hảo giữa nghệ thuật và sự thoải mái.', 4.7, 'ACTIVE', NOW()),
(7,  'San Premium Hotel',                   '36 & 38 Ha Trung',  'Hà Nội', 'Khách sạn cao cấp với tầm nhìn thành phố tuyệt đẹp và dịch vụ đẳng cấp.', 4.6, 'ACTIVE', NOW()),
(8,  'H Hotel L Art Hanoi',                 '74-76 Hang Ga',     'Hà Nội', 'Khách sạn nghệ thuật độc đáo, nơi hội tụ văn hóa và phong cách sống hiện đại.', 4.8, 'ACTIVE', NOW()),
(9,  'La Belle Maison',                     '55 Cau Go',         'Hà Nội', 'Ngôi nhà xinh đẹp phong cách Pháp, nhìn ra hồ Hoàn Kiếm thơ mộng.', 4.7, 'ACTIVE', NOW()),
(10, 'San Palace Hotel',                    '187 Hang Bong',     'Hà Nội', 'Khách sạn palace sang trọng, dịch vụ hoàn hảo tại trung tâm phố cổ Hà Nội.', 4.6, 'ACTIVE', NOW()),
(11, 'San Boutique Hotel',                  '24 Hang Hanh',      'Hà Nội', 'Khách sạn boutique ấm cúng, thiết kế tinh tế và dịch vụ chu đáo.', 4.5, 'ACTIVE', NOW()),
(12, 'Old Quarter Hotel',                   '23 Hang Hanh',      'Hà Nội', 'Nét đẹp cổ kính phố cổ Hà Nội, lý tưởng để khám phá văn hóa ngàn năm.', 4.4, 'ACTIVE', NOW()),
(13, 'Casa Valentina Hotel',                '49 Hang Ga',        'Hà Nội', 'Không gian ấm áp như ngôi nhà, phong cách Mediterranean sang trọng.', 4.6, 'ACTIVE', NOW())
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 3. ROOMS (đầy đủ tất cả phòng từ Drive)
-- Hotel 1: 8 phòng (id 1-8)
-- Hotel 2: 6 phòng (id 9-14)
-- Hotel 3: 4 phòng (id 15-18)
-- Hotel 4: 6 phòng (id 19-24)
-- Hotel 5: 4 phòng (id 25-28)
-- Hotel 6: 6 phòng (id 29-34)
-- Hotel 7: 4 phòng (id 35-38)
-- Hotel 8: 7 phòng (id 39-45)
-- Hotel 9: 3 phòng (id 46-48)
-- Hotel 10: 4 phòng (id 49-52)
-- Hotel 11: 4 phòng (id 53-56)
-- Hotel 12: 5 phòng (id 57-61)
-- Hotel 13: 5 phòng (id 62-66)
-- ==========================================
INSERT INTO rooms (id, hotel_id, name, type, price_per_night, capacity, quantity, description, created_at) VALUES
-- Hotel 1: Lucien Hanoi Lakeside Rooftop & Bar
(1,  1, 'Classic Double Room',      'STANDARD', 1200000, 2, 10, 'Phòng đôi cổ điển, nội thất sang trọng, view thành phố.',           NOW()),
(2,  1, 'Junior Double Or Twin Room','STANDARD', 1400000, 2, 8,  'Phòng junior rộng rãi, linh hoạt bố trí đôi hoặc twin.',           NOW()),
(3,  1, 'Junior Room With City View','SUPERIOR', 1600000, 2, 6,  'Phòng junior với view thành phố tuyệt đẹp.',                       NOW()),
(4,  1, 'Executive Double Room',    'DELUXE',   2200000, 2, 5,  'Phòng executive sang trọng, tiện nghi cao cấp.',                   NOW()),
(5,  1, 'Executive Balcony Room',   'DELUXE',   2600000, 2, 4,  'Phòng executive có ban công riêng view hồ.',                       NOW()),
(6,  1, 'Lucien Signature',         'SUITE',    3800000, 2, 3,  'Suite đặc trưng của Lucien, đỉnh cao sang trọng.',                 NOW()),
(7,  1, 'Family Connecting Room',   'SUITE',    4200000, 4, 2,  'Phòng gia đình thông nhau, không gian rộng rãi.',                  NOW()),
(8,  1, 'Suite Connecting Room',    'SUITE',    5000000, 4, 2,  'Suite thông nhau, lý tưởng cho gia đình hoặc nhóm.',               NOW()),
-- Hotel 2: Solare De Monte Hotel & Spa
(9,  2, 'Deluxe Double/Twin Room',  'DELUXE',   1800000, 2, 10, 'Phòng deluxe linh hoạt đôi hoặc twin, tiện nghi đầy đủ.',         NOW()),
(10, 2, 'Junior Double/Twin Room',  'STANDARD', 1400000, 2, 8,  'Phòng junior thoải mái, thiết kế hiện đại.',                      NOW()),
(11, 2, 'Junior Suite City View',   'SUPERIOR', 2000000, 2, 5,  'Phòng junior suite nhìn ra thành phố.',                           NOW()),
(12, 2, 'Premier City View Room',   'DELUXE',   2400000, 2, 4,  'Phòng premier với view thành phố toàn cảnh.',                     NOW()),
(13, 2, 'Family Room',              'SUITE',    3200000, 4, 3,  'Phòng gia đình rộng rãi, phù hợp nhóm đông.',                    NOW()),
(14, 2, 'Connecting Room',          'SUPERIOR', 2800000, 4, 2,  'Phòng thông nhau linh hoạt cho gia đình.',                        NOW()),
-- Hotel 3: Hanoi Emerald Waters Hotel & Spa
(15, 3, 'Deluxe Double/Twin Room',  'DELUXE',   1600000, 2, 10, 'Phòng deluxe view thành phố, thiết kế hiện đại.',                 NOW()),
(16, 3, 'Junior Double/Twin Room',  'STANDARD', 1300000, 2, 8,  'Phòng junior ấm cúng gần trung tâm phố cổ.',                     NOW()),
(17, 3, 'Deluxe Family',            'DELUXE',   2400000, 4, 4,  'Phòng deluxe gia đình không gian rộng rãi.',                      NOW()),
(18, 3, 'Family City View',         'SUITE',    3000000, 4, 3,  'Phòng gia đình nhìn ra thành phố tuyệt đẹp.',                    NOW()),
-- Hotel 4: Hotel Emerald Waters Classy
(19, 4, 'Superior Double/Twin Room','SUPERIOR', 1400000, 2, 12, 'Phòng superior tiện nghi, phong cách lịch lãm.',                  NOW()),
(20, 4, 'Deluxe Double Room',       'DELUXE',   1800000, 2, 8,  'Phòng deluxe đôi sang trọng, nội thất cao cấp.',                  NOW()),
(21, 4, 'Deluxe Twin Room',         'DELUXE',   1800000, 2, 6,  'Phòng deluxe twin thoải mái, thiết kế tinh tế.',                  NOW()),
(22, 4, 'Suite Balcony',            'SUITE',    3500000, 2, 3,  'Suite có ban công riêng, view phố cổ đẹp.',                       NOW()),
(23, 4, 'Connecting Room',          'SUPERIOR', 2600000, 4, 4,  'Phòng thông nhau tiện lợi cho gia đình.',                         NOW()),
(24, 4, 'Family Suite Balcony Room','SUITE',    4500000, 4, 2,  'Suite gia đình có ban công rộng.',                                NOW()),
-- Hotel 5: Hanoi Emerald Waters Hotel Valley
(25, 5, 'Deluxe Double',            'DELUXE',   1500000, 2, 10, 'Phòng deluxe yên tĩnh, không gian thư giãn.',                    NOW()),
(26, 5, 'Deluxe Twin',              'DELUXE',   1500000, 2, 8,  'Phòng deluxe twin view thành phố.',                              NOW()),
(27, 5, 'Executive Room',           'SUPERIOR', 2000000, 2, 5,  'Phòng executive tiện nghi, dịch vụ VIP.',                        NOW()),
(28, 5, 'Family Suite',             'SUITE',    3800000, 4, 3,  'Suite gia đình rộng rãi, đầy đủ tiện nghi.',                     NOW()),
-- Hotel 6: Hanoi Dalvostro Valentino Hotel
(29, 6, 'Classic Double',                  'STANDARD', 1300000, 2, 10, 'Phòng đôi cổ điển phong cách Ý.',                        NOW()),
(30, 6, 'Deluxe Double',                   'DELUXE',   1900000, 2, 8,  'Phòng deluxe đôi sang trọng kiểu Ý.',                    NOW()),
(31, 6, 'Suite Balcony Double/Twin Room',  'SUITE',    3200000, 2, 4,  'Suite ban công đôi/twin view phố cổ.',                    NOW()),
(32, 6, 'Junior Suite Balcony Room',       'SUPERIOR', 2400000, 2, 5,  'Junior suite có ban công riêng thoáng mát.',              NOW()),
(33, 6, 'Connecting Room',                 'SUPERIOR', 2800000, 4, 3,  'Phòng thông nhau tiện lợi cho gia đình.',                 NOW()),
(34, 6, 'Dalvostro Valentino Suite',       'SUITE',    5500000, 2, 2,  'Suite đặc trưng cao cấp nhất của khách sạn.',             NOW()),
-- Hotel 7: San Premium Hotel
(35, 7, 'Deluxe DBL/TWN No View',          'DELUXE',   1700000, 2, 10, 'Phòng deluxe tiện nghi đầy đủ.',                         NOW()),
(36, 7, 'Junior City View',                'SUPERIOR', 2100000, 2, 6,  'Phòng junior nhìn ra thành phố.',                        NOW()),
(37, 7, 'Premium Balcony with City View',  'DELUXE',   2800000, 2, 4,  'Phòng premium ban công view thành phố.',                 NOW()),
(38, 7, 'Family Connecting',               'SUITE',    4000000, 4, 3,  'Phòng gia đình thông nhau rộng rãi.',                    NOW()),
-- Hotel 8: H Hotel L Art Hanoi
(39, 8, 'Deluxe',                          'DELUXE',   2000000, 2, 10, 'Phòng deluxe phong cách nghệ thuật độc đáo.',            NOW()),
(40, 8, 'Junior Double Room',              'STANDARD', 1500000, 2, 8,  'Phòng junior hiện đại, thiết kế nghệ thuật.',            NOW()),
(41, 8, 'Executive Balcony Room',          'DELUXE',   2600000, 2, 5,  'Phòng executive có ban công riêng.',                     NOW()),
(42, 8, 'Executive City View Room',        'DELUXE',   2800000, 2, 4,  'Phòng executive view thành phố đẹp.',                   NOW()),
(43, 8, 'Family Room',                     'SUITE',    4000000, 4, 3,  'Phòng gia đình rộng rãi phong cách nghệ thuật.',         NOW()),
(44, 8, 'Privilege Room',                  'SUPERIOR', 3200000, 2, 3,  'Phòng privilege đặc quyền với tiện nghi VIP.',           NOW()),
(45, 8, 'L Art Signature',                 'SUITE',    6000000, 2, 1,  'Suite đặc trưng L Art, đỉnh cao nghệ thuật.',            NOW()),
-- Hotel 9: La Belle Maison
(46, 9, 'Suite Balcony City View (Double)','SUITE',    3500000, 2, 4,  'Suite ban công nhìn ra hồ Hoàn Kiếm, giường đôi.',       NOW()),
(47, 9, 'Suite Balcony City View (Twin)',  'SUITE',    3500000, 2, 4,  'Suite ban công nhìn ra hồ Hoàn Kiếm, giường twin.',      NOW()),
(48, 9, 'Executive Suite Lake View',       'SUITE',    5000000, 2, 2,  'Suite executive nhìn ra hồ, không gian tuyệt vời.',      NOW()),
-- Hotel 10: San Palace Hotel
(49, 10, 'Deluxe DBL/TWN with Window',    'DELUXE',   1900000, 2, 10, 'Phòng deluxe cửa sổ lớn view phố cổ.',                  NOW()),
(50, 10, 'Premium City View',             'SUPERIOR', 2400000, 2, 6,  'Phòng premium nhìn toàn cảnh thành phố.',               NOW()),
(51, 10, 'Executive Balcony',             'DELUXE',   3000000, 2, 4,  'Phòng executive với ban công riêng thoáng mát.',         NOW()),
(52, 10, 'Family City View',              'SUITE',    4200000, 4, 3,  'Suite gia đình nhìn ra thành phố.',                     NOW()),
-- Hotel 11: San Boutique Hotel
(53, 11, 'Deluxe Double with Window',     'DELUXE',   1600000, 2, 10, 'Phòng deluxe boutique ấm cúng có cửa sổ.',             NOW()),
(54, 11, 'Premium with Balcony',          'SUPERIOR', 2200000, 2, 6,  'Phòng premium có ban công riêng.',                     NOW()),
(55, 11, 'Executive with Balcony',        'DELUXE',   2800000, 2, 4,  'Phòng executive ban công rộng view phố.',              NOW()),
(56, 11, 'Family Balcony Room',           'SUITE',    4000000, 4, 2,  'Phòng gia đình có ban công lớn thoáng mát.',           NOW()),
-- Hotel 12: Old Quarter Hotel
(57, 12, 'Standard Double Room',          'STANDARD', 1100000, 2, 15, 'Phòng đôi tiêu chuẩn tại trung tâm phố cổ.',          NOW()),
(58, 12, 'Executive Triple Room',         'SUPERIOR', 2000000, 3, 6,  'Phòng executive cho 3 người, không gian rộng.',        NOW()),
(59, 12, 'Family Suite Balcony',          'SUITE',    3800000, 4, 3,  'Suite gia đình có ban công nhìn phố cổ.',              NOW()),
(60, 12, 'King Room with Lake View',      'DELUXE',   2600000, 2, 4,  'Phòng king view hồ Hoàn Kiếm tuyệt đẹp.',             NOW()),
(61, 12, 'Suite With Balcony',            'SUITE',    4500000, 2, 2,  'Suite có ban công riêng cao cấp.',                     NOW()),
-- Hotel 13: Casa Valentina Hotel
(62, 13, 'Deluxe Double Room',            'DELUXE',   1800000, 2, 8,  'Phòng deluxe đôi phong cách Mediterranean.',           NOW()),
(63, 13, 'Deluxe Twin Room',              'DELUXE',   1800000, 2, 8,  'Phòng deluxe twin không gian ấm áp.',                  NOW()),
(64, 13, 'Suite City View Room',          'SUITE',    3200000, 2, 4,  'Suite nhìn ra thành phố, thiết kế sang trọng.',        NOW()),
(65, 13, 'Suite Balcony Room',            'SUITE',    3800000, 2, 3,  'Suite có ban công riêng thoáng mát.',                  NOW()),
(66, 13, 'Family Suite City View Room',   'SUITE',    5000000, 4, 2,  'Suite gia đình view thành phố đẳng cấp.',              NOW())
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 4. ROOM_IMAGE (đầy đủ tất cả ảnh từ Drive)
-- ==========================================
INSERT INTO room_image (id, room_id, image_url) VALUES
-- Hotel 1 Room 1: Classic Double Room
(1,  1, 'https://drive.google.com/uc?export=view&id=1ND8OEQNNYKE6ijaupy2YZswNdOluriuY'),
(2,  1, 'https://drive.google.com/uc?export=view&id=1qg16cHYv9bKgcqotsPMFMBgFDXFLdrsB'),
(3,  1, 'https://drive.google.com/uc?export=view&id=1po0uIoOg1ZRkzgFHs6vHwq98JA5mCeBb'),
-- Hotel 1 Room 2: Junior Double Or Twin Room
(4,  2, 'https://drive.google.com/uc?export=view&id=1nilseaHUg-kbMkrs5PS86AOPxJ_m-dyw'),
(5,  2, 'https://drive.google.com/uc?export=view&id=1n_nMfDlHVAZ7yJ28NNxn2yGyJceBMGL3'),
(6,  2, 'https://drive.google.com/uc?export=view&id=1mNL5goskpVyqcNRliII5YE-FmjjZwZOY'),
-- Hotel 1 Room 3: Junior Room With City View
(7,  3, 'https://drive.google.com/uc?export=view&id=1m3Ax_uw-vuyLxRcGpFz94T9X-O6F5isB'),
(8,  3, 'https://drive.google.com/uc?export=view&id=1k8X6mVe8sQ4nk02oiN1oSxGwsEAjUOId'),
(9,  3, 'https://drive.google.com/uc?export=view&id=1gfIVpHw1IxL9zLBkRu3xDoHo0Embs1Lu'),
-- Hotel 1 Room 4: Executive Double Room
(10, 4, 'https://drive.google.com/uc?export=view&id=1g5BVTbE3JBS0Vorx_KFugyuC7tKmVMK4'),
(11, 4, 'https://drive.google.com/uc?export=view&id=143nO0Q5wZocARrGJg4PY_ubYdbf9zdDf'),
(12, 4, 'https://drive.google.com/uc?export=view&id=1G1Qd3zTqSLa3Zoidj2c8f-nbGL2mzL7O'),
(13, 4, 'https://drive.google.com/uc?export=view&id=1MXYr1hmfsKCdxGRZDy57GPcdDwvMmVyU'),
(14, 4, 'https://drive.google.com/uc?export=view&id=129578K201sStrWPImKTM73oGtktU2ZU8'),
(15, 4, 'https://drive.google.com/uc?export=view&id=1GgZeK6yQhMAvZkYdsno3piu4IFQRf7eh'),
-- Hotel 1 Room 5: Executive Balcony Room
(16, 5, 'https://drive.google.com/uc?export=view&id=1JN3XuXKmZPKRTsAYjBjYb8torVFAWPVU'),
(17, 5, 'https://drive.google.com/uc?export=view&id=16XhwjBdJXR1G2RAygFitfvIFHmiXoSt1'),
(18, 5, 'https://drive.google.com/uc?export=view&id=15BSDpa3iaqL7IkNAs4CZevnLhzduaABI'),
(19, 5, 'https://drive.google.com/uc?export=view&id=11eSHrpj4puZ1V7g30pbWPzRm4KJNQ56x'),
(20, 5, 'https://drive.google.com/uc?export=view&id=1mXU-hFZUUei-Bfx1uJKwoG8jt2i2S4QY'),
-- Hotel 1 Room 6: Lucien Signature
(21, 6, 'https://drive.google.com/uc?export=view&id=1qDUXUNLkIExsiegQrAJSlbrNRmvLpxzt'),
(22, 6, 'https://drive.google.com/uc?export=view&id=1SISZJZfK2ML7JtJGO71UvFwVLGu_8_Hh'),
(23, 6, 'https://drive.google.com/uc?export=view&id=1M4g-gYd_d_UNMr6rkImUbF1oeDMAnokv'),
(24, 6, 'https://drive.google.com/uc?export=view&id=1XDmpu7FE5X-_D25ndcsIIhjkuFfeiTMM'),
(25, 6, 'https://drive.google.com/uc?export=view&id=1MpyGVfOD2dfz0rtxjaCFhWAU1BhfZxxd'),
-- Hotel 1 Room 7: Family Connecting Room
(26, 7, 'https://drive.google.com/uc?export=view&id=1RnGciodCaQpSQObztwJwyiYoVYQRk5PB'),
(27, 7, 'https://drive.google.com/uc?export=view&id=1EH0VhvIcSJknvE-_rOI8U1Qds4KjCHs7'),
(28, 7, 'https://drive.google.com/uc?export=view&id=1A4jPXOCkF2UiJjiFuJv_owTaYNsaeBTR'),
(29, 7, 'https://drive.google.com/uc?export=view&id=1JABYFxN6Ma43KhRvAyLR0o3cNCc1N-0h'),
(30, 7, 'https://drive.google.com/uc?export=view&id=1OFHp2D2D66v78bn5_2zCOGAUfh-LkVZj'),
(31, 7, 'https://drive.google.com/uc?export=view&id=1EDY0wVPhuqHrD6t2xtvScyrXVerhHjgN'),
(32, 7, 'https://drive.google.com/uc?export=view&id=1pJbXojnCuW4QkC6X7EQtYWMNVm8cNT-o'),
(33, 7, 'https://drive.google.com/uc?export=view&id=1thgRMpYWmwjnol4apBhNTy_C--i1D99Y'),
-- Hotel 1 Room 8: Suite Connecting Room
(34, 8, 'https://drive.google.com/uc?export=view&id=1bMi8U6zOEipupb7zePn5GyB5Alq1_QVQ'),
(35, 8, 'https://drive.google.com/uc?export=view&id=18EIlCy8khoLi3NtM6hNB3Lrxr69Ow4os'),
(36, 8, 'https://drive.google.com/uc?export=view&id=1s45XUlYEEIhoHKF8P86YEaxvQoaKCywN'),
(37, 8, 'https://drive.google.com/uc?export=view&id=18TMJSgGBr28wzS4ArRUtJbPxwn6Gvksb'),
(38, 8, 'https://drive.google.com/uc?export=view&id=1ciejK4PgeHeQ9V7HvHrMawnM4FFokcNo'),
(39, 8, 'https://drive.google.com/uc?export=view&id=1AEta_T3-zYzYx3C8u5pqfKgI6yvIABxl'),
(40, 8, 'https://drive.google.com/uc?export=view&id=1WwPS__B6koY7H9T9l7-QFrgD1U1mE2IY'),
-- Hotel 2 Room 9: Deluxe Double/Twin Room
(41, 9,  'https://drive.google.com/uc?export=view&id=1qONS4s11QZMGV7qldVKoLk_z6VURDBTb'),
(42, 9,  'https://drive.google.com/uc?export=view&id=1xRr2nZm4fMDDPAwewS4ovRQIDrfHUCnO'),
(43, 9,  'https://drive.google.com/uc?export=view&id=1gjumRbag5qZeNZJ9jFPsI8qow-vZN82D'),
(44, 9,  'https://drive.google.com/uc?export=view&id=13IHvnsQm86aBgWXuzRV-H9fpXO72nBUU'),
(45, 9,  'https://drive.google.com/uc?export=view&id=1UnLc6YGjZP_b6qbjuReVptgdlN86aTvb'),
-- Hotel 2 Room 10: Junior Double/Twin Room
(46, 10, 'https://drive.google.com/uc?export=view&id=1JzEf308lgopF7_yEW8NuD8X0KlEz3hk7'),
(47, 10, 'https://drive.google.com/uc?export=view&id=1bKpUYsCiZ8BUl9yd0PdhrQoghXXU25Qz'),
(48, 10, 'https://drive.google.com/uc?export=view&id=1ZK8CXiw0T-qAHew0QONeUl5ftV_-ZBe2'),
(49, 10, 'https://drive.google.com/uc?export=view&id=13kWGu27J4-uAPeHRr3RSrQ2o-Go27pYC'),
(50, 10, 'https://drive.google.com/uc?export=view&id=1AQvRVEyDlUq7Ukq1xto5w6JJlazEnN7C'),
(51, 10, 'https://drive.google.com/uc?export=view&id=1UclGXc9zwYoVkXefsxfsnZty73MA-qYp'),
(52, 10, 'https://drive.google.com/uc?export=view&id=1BebwsmRNwLvzqwLdL95S7wRZlfg-xzC-'),
(53, 10, 'https://drive.google.com/uc?export=view&id=1aOR-98KakW3YSKzHvpFyirahcUoYEVU4'),
-- Hotel 2 Room 11: Junior Suite City View
(54, 11, 'https://drive.google.com/uc?export=view&id=1tzJZvI22T1mZI4fsnCAFKgYhO6mHPcla'),
(55, 11, 'https://drive.google.com/uc?export=view&id=1gGqvQeNc-6WHaB8DEtdkmU5PEnvPGsMa'),
(56, 11, 'https://drive.google.com/uc?export=view&id=1zLRfuth15qaMzrb47JNmbi1j27VWOrEl'),
(57, 11, 'https://drive.google.com/uc?export=view&id=1b3hOsRyd7glajHAuzZrsPn65_ayWa3vI'),
(58, 11, 'https://drive.google.com/uc?export=view&id=1nueoDjhtYWbNU5rH-6aADy76qWjuHxk8'),
(59, 11, 'https://drive.google.com/uc?export=view&id=1tKoyAdU24kTfWa3UhJU7I0k-MMkvBS-c'),
(60, 11, 'https://drive.google.com/uc?export=view&id=1C23i1F0YyjwlmidGVOe8VxMksBHD9rst'),
(61, 11, 'https://drive.google.com/uc?export=view&id=1d2pFTzbBbje0b5LVxHO-I0H8c8JgYBeT'),
-- Hotel 2 Room 12: Premier City View Room
(62, 12, 'https://drive.google.com/uc?export=view&id=1sx8dbre7KWSWJVV0zqQfgDmfhUHhpWqH'),
(63, 12, 'https://drive.google.com/uc?export=view&id=1Ujzt_euI_WolC3nZaKA1nWOeAhaP3QsS'),
(64, 12, 'https://drive.google.com/uc?export=view&id=1AezzwbvhIkno12jzWGdlnca1M1cAIveG'),
(65, 12, 'https://drive.google.com/uc?export=view&id=18VMngMxASaPtHEZm-0sdzc5uNXFL03hL'),
(66, 12, 'https://drive.google.com/uc?export=view&id=1Vf1NTZcilrus_R_T4xH9gZCigHAo6r4b'),
-- Hotel 2 Room 13: Family Room
(67, 13, 'https://drive.google.com/uc?export=view&id=1N3RsFhY7Gm3-VHQzd2HuuaroibiryXmo'),
(68, 13, 'https://drive.google.com/uc?export=view&id=1so6pe2I2Jh6Cdj0ltIW3ep1ND8qItmyx'),
(69, 13, 'https://drive.google.com/uc?export=view&id=1UWsg3Hiz4QQQqDZaWbTW0CHh3Mwcm7yi'),
(70, 13, 'https://drive.google.com/uc?export=view&id=1Gy_I8q1AWr9hcXTfl_lJ2l1Cr7hr0wly'),
(71, 13, 'https://drive.google.com/uc?export=view&id=120anBUv49pcKUebZQPCXYeCvIkQpI0d1'),
(72, 13, 'https://drive.google.com/uc?export=view&id=1Q5xS4BmMRMQ8KxAfFBNPNrlhI7j5rEKy'),
-- Hotel 2 Room 14: Connecting Room
(73, 14, 'https://drive.google.com/uc?export=view&id=18U8-NpaDDQauCKDcw8bTNE5PMHdB2H5n'),
(74, 14, 'https://drive.google.com/uc?export=view&id=1AezoHrwHbskWt5fUb-_4npDO0Hl-1IPk'),
(75, 14, 'https://drive.google.com/uc?export=view&id=1AvucV2D2CzGfjPGIyYosgvQ6DrRWkVoG'),
(76, 14, 'https://drive.google.com/uc?export=view&id=1Uj0G_4TQ2SpJrIA5u_R_Dkillkcq1QcX'),
(77, 14, 'https://drive.google.com/uc?export=view&id=1VzNjSKKcfUO0eZYtUWhdKIeKqKgaETyX'),
(78, 14, 'https://drive.google.com/uc?export=view&id=1DblRHwA2FZ-9gqROM03UMsL3dS441z1B'),
(79, 14, 'https://drive.google.com/uc?export=view&id=1NCcYtL1_WvgXvsM0NR3v-9ymimtFGkWX'),
(80, 14, 'https://drive.google.com/uc?export=view&id=1cnWKk8cEOBGwFAcCTK96FTrxoxsCBGh0'),
(81, 14, 'https://drive.google.com/uc?export=view&id=1n8uP3WvyAmEOY7UdERz_OnZZw_o7igbl'),
(82, 14, 'https://drive.google.com/uc?export=view&id=15-DYq-EA3xsYTuEIBagOEpOOI83HkEzW'),
(83, 14, 'https://drive.google.com/uc?export=view&id=1wsnS1nMyrpDnVgVFAgofNGkOIivstoM3'),
-- Hotel 3 Room 15: Deluxe Double/Twin Room
(84, 15, 'https://drive.google.com/uc?export=view&id=1eckT7SLaBlxEl3CEwZ7jLTYT15yt_TbK'),
(85, 15, 'https://drive.google.com/uc?export=view&id=1TK_3GKwYfd15ynMZOxTyCfYwJrsgpu76'),
(86, 15, 'https://drive.google.com/uc?export=view&id=1jtawrsw1xLFxnl2BGXcxzp95tU3_yMBl'),
(87, 15, 'https://drive.google.com/uc?export=view&id=19P4k7wLq1I6_36FfzfeFNtD9pZ9IU6fh'),
(88, 15, 'https://drive.google.com/uc?export=view&id=1vbhHU_nZPGZbPzCursI4O0rG_DgAKQYp'),
-- Hotel 3 Room 16: Junior Double/Twin Room
(89, 16, 'https://drive.google.com/uc?export=view&id=19bTWGmcohP4dMTBMx0mKSC9Rxuk6cocf'),
(90, 16, 'https://drive.google.com/uc?export=view&id=131en9jrxzkazGXrebkHUbLSYiSOXwPb_'),
(91, 16, 'https://drive.google.com/uc?export=view&id=1huHSz5yYbumZN9fD9kbpMfS7A04RUigk'),
(92, 16, 'https://drive.google.com/uc?export=view&id=1hPDA8CulOgo9350O6rYNAi8ioCHzVmtY'),
-- Hotel 3 Room 17: Deluxe Family
(93, 17, 'https://drive.google.com/uc?export=view&id=1ognJgAYcVEijlGwinR1HuY4gIR79sQlx'),
(94, 17, 'https://drive.google.com/uc?export=view&id=1i-vldi84AGpDDVTvFBvkkBDfX-7Bn2hw'),
(95, 17, 'https://drive.google.com/uc?export=view&id=13Ks1uovggSjqwTNitFDAkFu3R74cawtX'),
(96, 17, 'https://drive.google.com/uc?export=view&id=1HoyhIaVllPToEGoXREYk3qB6zFuC_7Wa'),
(97, 17, 'https://drive.google.com/uc?export=view&id=1bRv6-QSUJ9OKWjnwOkz4JNPvhmpVAs6d'),
-- Hotel 3 Room 18: Family City View
(98,  18, 'https://drive.google.com/uc?export=view&id=1ACVaVJ0sZYmxiti0J4PMcFyoJDUnc22_'),
(99,  18, 'https://drive.google.com/uc?export=view&id=1qR9HQXC9yT1Qm6cHp5HEz7n2lqIXmiNC'),
(100, 18, 'https://drive.google.com/uc?export=view&id=1PanfatCzaeNOvp-dztfCRsFbJMlf7VVo'),
(101, 18, 'https://drive.google.com/uc?export=view&id=1L_ggVU2tyG0oo3WVCgzH3-YQKFOENX3f'),
(102, 18, 'https://drive.google.com/uc?export=view&id=1RBuVYsygk8UrDnqxpLEvTKhRU3BvArLE'),
(103, 18, 'https://drive.google.com/uc?export=view&id=1odV-I5pPg-tGheZjiOn3Z3Vvg7tufLk6'),
-- Hotel 4 Room 19: Superior Double/Twin Room
(104, 19, 'https://drive.google.com/uc?export=view&id=1c_jwvjPZjt0OBZWV2NG5DQGNomzBdEuD'),
(105, 19, 'https://drive.google.com/uc?export=view&id=10tiNvJn9Dw-r0h4Ht_zoJ9RovnjtPI8L'),
(106, 19, 'https://drive.google.com/uc?export=view&id=1OF10XQ8_VKH5w9-tKw-lQfCWk07sJKHo'),
(107, 19, 'https://drive.google.com/uc?export=view&id=17YThipz5q_KmSB5w56zFdm6caL5-Bju_'),
(108, 19, 'https://drive.google.com/uc?export=view&id=1LZD2u3HkU4EYcr_RXXCxgifq5x84Xwm7'),
(109, 19, 'https://drive.google.com/uc?export=view&id=1L_FPp6i50Syr9QNNp4Va1wKsoghl62I0'),
(110, 19, 'https://drive.google.com/uc?export=view&id=15eSWu3tb0buwbkNT4GLRzndBOVc9cdDO'),
(111, 19, 'https://drive.google.com/uc?export=view&id=1P15GCGErFg7uchQFgtphlTjCbhKUb1ld'),
(112, 19, 'https://drive.google.com/uc?export=view&id=1EM5EeNDOGlAy78oUmR8PiuYFOtWzkT2V'),
-- Hotel 4 Room 20: Deluxe Double Room
(113, 20, 'https://drive.google.com/uc?export=view&id=13U4Qepx888FLxIprXk5J0Lvi8vO27iL9'),
(114, 20, 'https://drive.google.com/uc?export=view&id=1s-rzKYQcba8gSjli_e0NRmEnHP-B-DML'),
(115, 20, 'https://drive.google.com/uc?export=view&id=1TyvwWnoiv8bVWgYJoTDI0kATNXnoOufi'),
(116, 20, 'https://drive.google.com/uc?export=view&id=1B3UI_Y5yK89msbxgV7N1OWL4tW_IofVg'),
(117, 20, 'https://drive.google.com/uc?export=view&id=1YfJONqKexg9MJ79nWv-Gw-yR7q6XV3xa'),
(118, 20, 'https://drive.google.com/uc?export=view&id=1-jhuUWSLndzcpSs4_nOeFiz9P1RSMvAE'),
(119, 20, 'https://drive.google.com/uc?export=view&id=1ZScjTv-BlL1hPSfNE8fEHZrEyjKtsmkO'),
-- Hotel 4 Room 21: Deluxe Twin Room
(120, 21, 'https://drive.google.com/uc?export=view&id=1UWg37JwMVBST9Hwzz3Nkui6bvCV0LGa6'),
(121, 21, 'https://drive.google.com/uc?export=view&id=101-OO3-6T9XF04IJ41opO9RguMRsCqa4'),
(122, 21, 'https://drive.google.com/uc?export=view&id=11BVu3kGPexT9QHssi0kzdOwV03S57RAK'),
(123, 21, 'https://drive.google.com/uc?export=view&id=1db4Ze0LBmchuE2bUtYc1gC5sJVvDxaMi'),
(124, 21, 'https://drive.google.com/uc?export=view&id=1nFRYKqy9s1VTP0fXZXif4LhHbmrAg3MM'),
(125, 21, 'https://drive.google.com/uc?export=view&id=1nLGBRm8ipIa9WQjbMPv3x1N9DEQTRVnT'),
(126, 21, 'https://drive.google.com/uc?export=view&id=12JwT42i_MAiTMU6Ati2IZBbD8P3UKXK3'),
-- Hotel 4 Room 22: Suite Balcony
(127, 22, 'https://drive.google.com/uc?export=view&id=1Dc-2sCTYFeZl-NvwloRmzwNtqJtxXJcc'),
(128, 22, 'https://drive.google.com/uc?export=view&id=1MujQOruRdi0a7hrAylU7ujK996o5rsoY'),
(129, 22, 'https://drive.google.com/uc?export=view&id=1aR1YAHU9rcV7yb6P8Nl-gzbUglN2rV0Q'),
(130, 22, 'https://drive.google.com/uc?export=view&id=1tDj-uS23kjXXw_06KQSsflCFNEsgzvii'),
(131, 22, 'https://drive.google.com/uc?export=view&id=1pFdpiFgO-v431fYJx6jUMAI4ujFQEhte'),
(132, 22, 'https://drive.google.com/uc?export=view&id=1bp6t6SD5DNAT-Udic-g6CkzF4ag670ae'),
(133, 22, 'https://drive.google.com/uc?export=view&id=1el8XyH-494S1Ystp8F2qxwpQviUa4vPF'),
(134, 22, 'https://drive.google.com/uc?export=view&id=1DId3EB2OrtRN0lnhpwXh6ssIHDWswzhv'),
-- Hotel 4 Room 23: Connecting Room
(135, 23, 'https://drive.google.com/uc?export=view&id=1sITy_ZZYFjaNFjzUU0y7p0CyRiOVGZty'),
(136, 23, 'https://drive.google.com/uc?export=view&id=1t5Xctl79n-xHghbjLd9PHkpxwzrv915N'),
(137, 23, 'https://drive.google.com/uc?export=view&id=1ot6VctLauNh8vWJIEi7fdWcMJCgb9PAc'),
(138, 23, 'https://drive.google.com/uc?export=view&id=1zCaV19WiHL5qK8i8EZfvSmzOw8TrvF0g'),
(139, 23, 'https://drive.google.com/uc?export=view&id=1mdVPl8Ybsi2JxhnC4Qor87CV46GZRd0w'),
(140, 23, 'https://drive.google.com/uc?export=view&id=19IPwQk3BAVpUtt9o9mUTKzACEUnnHcJW'),
-- Hotel 4 Room 24: Family Suite Balcony Room
(141, 24, 'https://drive.google.com/uc?export=view&id=1az1QqtUT5kf1pPYp6Knf8_hOGfGDD_z3'),
(142, 24, 'https://drive.google.com/uc?export=view&id=1DzSTjlZKI3UOj7Mn0xEvo_SCuqLD0oQX'),
(143, 24, 'https://drive.google.com/uc?export=view&id=1hOTc7tdVa7J_igcSRge8ig9r1POmePWm'),
(144, 24, 'https://drive.google.com/uc?export=view&id=1PlIhUO34Pd80jlnm3eIjt0RT0URrE-Q5'),
(145, 24, 'https://drive.google.com/uc?export=view&id=15hY7cLRN5NrjM9fkBQhWTWylf2gsfwv5'),
-- Hotel 5 Room 25: Deluxe Double
(146, 25, 'https://drive.google.com/uc?export=view&id=11uJ1HLMyKjOuT-be4_-0Ui7xNUnrrk3n'),
(147, 25, 'https://drive.google.com/uc?export=view&id=15uD6Osh4sYfZJkjLwoW1kxy5RuoYNU27'),
(148, 25, 'https://drive.google.com/uc?export=view&id=1ZTv9ZdWV9ki6WAmG9bWbWt_1oeI1gm5l'),
(149, 25, 'https://drive.google.com/uc?export=view&id=1vMaBuHFJ7ECz8P87nWcHWRCIshQWnR-G'),
(150, 25, 'https://drive.google.com/uc?export=view&id=1Pdp9dxYbKadOme42WwFKoKjOOs6xMPrG'),
(151, 25, 'https://drive.google.com/uc?export=view&id=1EpKU8qKFvEzCL2abCbulJRBvO96iz6H6'),
(152, 25, 'https://drive.google.com/uc?export=view&id=1N_MW8RLIjnYLwAeBFlb1U62eJnsmqaJV'),
(153, 25, 'https://drive.google.com/uc?export=view&id=10u5epcP0ndmH8h-MWieBjB0BVtSo4uSD'),
(154, 25, 'https://drive.google.com/uc?export=view&id=17ZyHtSWEHgPUhxLIxWkk4F-_c3nVckxN'),
(155, 25, 'https://drive.google.com/uc?export=view&id=1D2wg-g0o3sVhbZq1XOgHv_-sPSPgyLx-'),
-- Hotel 5 Room 26: Deluxe Twin
(156, 26, 'https://drive.google.com/uc?export=view&id=1vnfubBGVDhslLo5Azgb2ql1SI7sZMyH8'),
(157, 26, 'https://drive.google.com/uc?export=view&id=1oe72Zig-f0ineR-s4a2iLLzW9jwzwkB7'),
(158, 26, 'https://drive.google.com/uc?export=view&id=1712IhK6fYl1CZp3etpIb0YI7OY90A6am'),
(159, 26, 'https://drive.google.com/uc?export=view&id=1bsyWjLcw4HrANCHatMTpZyBR90J0nE6G'),
-- Hotel 5 Room 27: Executive Room
(160, 27, 'https://drive.google.com/uc?export=view&id=1mU5S_lxferGUHMOlxhTzMaDOYmE9snI_'),
(161, 27, 'https://drive.google.com/uc?export=view&id=1N44Kx4zOASx6J-7h4ZnvmqeL78ZArZ7G'),
(162, 27, 'https://drive.google.com/uc?export=view&id=1Xf41bANvY2zZttAurR3LfKGZj7leorVT'),
(163, 27, 'https://drive.google.com/uc?export=view&id=1Z0Obo14l7WVtfKqkyJXE2Zh4C-F9eA_r'),
(164, 27, 'https://drive.google.com/uc?export=view&id=1lCjYcM1jTeqN6fmQt3ezsJOVcocroC6J'),
(165, 27, 'https://drive.google.com/uc?export=view&id=1FnNGdBKjehk2uupoc2NlMvTEcUW5Qg1e'),
(166, 27, 'https://drive.google.com/uc?export=view&id=1ZDGUwuQ9gnCCVXd26ZIlMe7pE4AtPmhq'),
-- Hotel 5 Room 28: Family Suite
(167, 28, 'https://drive.google.com/uc?export=view&id=1SBiLfavHcxWIq2WxX5qyqs47A4Zmhtv5'),
(168, 28, 'https://drive.google.com/uc?export=view&id=1YdKR3gUTp7T1WWJpuun2dmT3FJN5MZdK'),
(169, 28, 'https://drive.google.com/uc?export=view&id=1ZAtPjzVwnsvvy9up8WNtIVItb3t7nLW4'),
(170, 28, 'https://drive.google.com/uc?export=view&id=1oGFcThRsR6UlZzV-8Y71wfhyq_NbE1OB'),
(171, 28, 'https://drive.google.com/uc?export=view&id=1jQHtpNC72e9tXTfdjC3AFNHL0o7XziBM'),
(172, 28, 'https://drive.google.com/uc?export=view&id=1ps_QY4XBI5qYRAg-2FEPieW-2GTp6W8x'),
(173, 28, 'https://drive.google.com/uc?export=view&id=1duMviDb47WRjw1NP3BsSFaB6vxh6SLVV'),
-- Hotel 6 Room 29: Classic Double
(174, 29, 'https://drive.google.com/uc?export=view&id=1sPlAhyMwddvm0aaKNaBX5t777E3BTOi3'),
(175, 29, 'https://drive.google.com/uc?export=view&id=1wWB2_W6n0NZRhsn8GsDaOsXT2zmk8dFU'),
(176, 29, 'https://drive.google.com/uc?export=view&id=1xnnbJWm-8cgZ5LYsXGWMoiFP7TIhJ-hm'),
(177, 29, 'https://drive.google.com/uc?export=view&id=1K_DhP7auy9W7cQc8GvKGAeNp6DE2QwTp'),
(178, 29, 'https://drive.google.com/uc?export=view&id=1tYVFo40HevVpfJJFCZfErvZzAI9llvsg'),
(179, 29, 'https://drive.google.com/uc?export=view&id=1BWgpYeO9ehbNR3BViB4PFSZjHxm8_wdg'),
-- Hotel 6 Room 30: Deluxe Double
(180, 30, 'https://drive.google.com/uc?export=view&id=1AVYAfSD7FXPrJvQRdQfR_42gDzPCTZeV'),
(181, 30, 'https://drive.google.com/uc?export=view&id=1GaKWV8uAo-g_-pJJbLKx0KbmoP6RCPCa'),
(182, 30, 'https://drive.google.com/uc?export=view&id=15GdGCarZGpvmvhaEqexO8Yzs1M1jTlSl'),
(183, 30, 'https://drive.google.com/uc?export=view&id=1cPu9kMK22mwdmeOzKYl8MUhkpdLHLr4l'),
(184, 30, 'https://drive.google.com/uc?export=view&id=1RP6Z-gl_UqeQr9CpTpKH58u0rn310-Ow'),
(185, 30, 'https://drive.google.com/uc?export=view&id=1pImzeK2Wk6i9vTmso17CaDlaCfyIgRCf'),
-- Hotel 6 Room 31: Suite Balcony Double/Twin
(186, 31, 'https://drive.google.com/uc?export=view&id=1ll4QXZofzwnoCS4_mXM9PVQCvStHZ_sY'),
(187, 31, 'https://drive.google.com/uc?export=view&id=1a708TDoB43QHLPA7ubpXC40iSDr6D12k'),
(188, 31, 'https://drive.google.com/uc?export=view&id=1SFK9kZ8mw9Fbt-EYFTfgFFyhc6LlX16w'),
(189, 31, 'https://drive.google.com/uc?export=view&id=1ECo0Hwm4PEAeaDOMZ7MXpMorTGouJMmh'),
(190, 31, 'https://drive.google.com/uc?export=view&id=1oZLB2Uk2Bj99H_StXPHIrqOl8SjPzoKu'),
(191, 31, 'https://drive.google.com/uc?export=view&id=1fhc4HDycc4Hpie1V_bohkNO8B87bD6Gn'),
(192, 31, 'https://drive.google.com/uc?export=view&id=1AsjOE1ZRIkpl1UTnLaqNL5px9FBEwHjs'),
(193, 31, 'https://drive.google.com/uc?export=view&id=1aniuzd_wu0m7f7cTZRBNpUic4QAwfP7a'),
-- Hotel 6 Room 32: Junior Suite Balcony
(194, 32, 'https://drive.google.com/uc?export=view&id=1B5O1H9f6oo16_sItmkpVXJB0ayWb4MTn'),
(195, 32, 'https://drive.google.com/uc?export=view&id=1zQrBhp7IDHH8rIo0wiDUJGZsuGVXZyVS'),
(196, 32, 'https://drive.google.com/uc?export=view&id=19FUm_qXWEyL8Ciji2P1vFKaW2sZWyQ1C'),
(197, 32, 'https://drive.google.com/uc?export=view&id=1f02UHiGpXtdUeIfYLcDkgM91v92VbILk'),
(198, 32, 'https://drive.google.com/uc?export=view&id=185q31mh7HtIuPYgeW4b7xADcivux_W44'),
(199, 32, 'https://drive.google.com/uc?export=view&id=1pYjOe5_ARIzSQFIl_MRUGq0-tXNlkCes'),
-- Hotel 6 Room 33: Connecting Room
(200, 33, 'https://drive.google.com/uc?export=view&id=1dimckxi1MCmIM0pLVyqDlAPtW-mtRPTB'),
(201, 33, 'https://drive.google.com/uc?export=view&id=1AWXGIwXwS8guh3zrx0UvW0xybhKFMaO-'),
(202, 33, 'https://drive.google.com/uc?export=view&id=1vcYonzscxqjwkxkZnHaf2SUDfAg6zhKd'),
(203, 33, 'https://drive.google.com/uc?export=view&id=1kqFfccFcTIBetmpT5gaKL0GA9V9iOu-R'),
(204, 33, 'https://drive.google.com/uc?export=view&id=1_5HJzKxct4g2v-zGCFuGTWnClY57PGCG'),
(205, 33, 'https://drive.google.com/uc?export=view&id=193qIv9P7hCIUmOZ_iiqnl30II9kpbWWn'),
(206, 33, 'https://drive.google.com/uc?export=view&id=131NLjODbIsrGhOKTtWYaC5VfnMp7vfBe'),
-- Hotel 6 Room 34: Dalvostro Valentino Suite
(207, 34, 'https://drive.google.com/uc?export=view&id=150kBfukLC6rmg7tquD1iNY7_RWyqPcKy'),
(208, 34, 'https://drive.google.com/uc?export=view&id=1F6al1DEQBp-4YNZdlKX_n28kCfC2UXOM'),
(209, 34, 'https://drive.google.com/uc?export=view&id=1t72_4-wSqbT0dgILNpHv9anVYHM3SOct'),
(210, 34, 'https://drive.google.com/uc?export=view&id=1OdPFP8COXWeDRmb7gYIRnmNvkMRiw8SP'),
(211, 34, 'https://drive.google.com/uc?export=view&id=1mYiW2j-yBxeKhOXe43aqLSvclZWzkPNz'),
(212, 34, 'https://drive.google.com/uc?export=view&id=1CSTPUnaChccAdV7kUFu7-Pq3EtiowpfK'),
(213, 34, 'https://drive.google.com/uc?export=view&id=1Ztk4WrcvL2DdB8MX92_RHS-OfCEFhqQm'),
-- Hotel 7 Room 35: Deluxe DBL/TWN No View
(214, 35, 'https://drive.google.com/uc?export=view&id=138d3cVjUQVrmsTDvl8iuPKBgCPjcrps9'),
(215, 35, 'https://drive.google.com/uc?export=view&id=1Lw46dktHT1DjhO739WaiMBxyahjexdGW'),
(216, 35, 'https://drive.google.com/uc?export=view&id=1lifXL8Nynkr5FokBxmztXhHMcqs9TUaa'),
(217, 35, 'https://drive.google.com/uc?export=view&id=17SwCDlj7HqPKSLJYyddAD9OwuQTfTkiZ'),
(218, 35, 'https://drive.google.com/uc?export=view&id=1Hy_ciZKjiU0TirAkWJs0vC4kNKQ3lmov'),
-- Hotel 7 Room 36: Junior City View
(219, 36, 'https://drive.google.com/uc?export=view&id=1d4_OGX88uCcwmk7geKx7EHAuXcj9u35j'),
(220, 36, 'https://drive.google.com/uc?export=view&id=15A498sz6dohL3XLrgZay2CtIVzIHYi-m'),
(221, 36, 'https://drive.google.com/uc?export=view&id=1ducXcffMiijf5qbccvpyFW3v_6s-qEqj'),
(222, 36, 'https://drive.google.com/uc?export=view&id=1rqlSN30996IJ_6YUh_86-HwKNhxXRmll'),
(223, 36, 'https://drive.google.com/uc?export=view&id=1Ea340he6Nw7q1pcDdT6Tk9FJSviLFUb_'),
(224, 36, 'https://drive.google.com/uc?export=view&id=1xRO-PsFvjdYg_XYTi0TM42XRIVVy8Kj3'),
(225, 36, 'https://drive.google.com/uc?export=view&id=1BWy6FjcUCiP_aSEZy0B23Z4-zNV5gHNJ'),
(226, 36, 'https://drive.google.com/uc?export=view&id=1IOAdze0AufGsk3l_gsZ8Nk-oypKIRyvr'),
(227, 36, 'https://drive.google.com/uc?export=view&id=1XN3xkuujXRV2aQvJLghtgG-8HQccxX2X'),
(228, 36, 'https://drive.google.com/uc?export=view&id=1Ih5JFwpvJtphBDDreqA8osRorxcTzjHb'),
(229, 36, 'https://drive.google.com/uc?export=view&id=1LgUWeCL6aoC719ZJ4r7KFRyHV0Go9eNr'),
(230, 36, 'https://drive.google.com/uc?export=view&id=1DgGRgqB1G_oZUAV8YDlDBNh-O38RwKxC'),
-- Hotel 7 Room 37: Premium Balcony with City View
(231, 37, 'https://drive.google.com/uc?export=view&id=1MymdM_hfaEAzsxjHZY1_oNFJrHh-sd1s'),
(232, 37, 'https://drive.google.com/uc?export=view&id=1cZXawpCXPC5IveB6wO3Ayi6keyCb4k6e'),
(233, 37, 'https://drive.google.com/uc?export=view&id=1WDc9yyOgg6DruE6ttLJ8LF4cBIKAExBp'),
(234, 37, 'https://drive.google.com/uc?export=view&id=1X41KapBV5tzsFa4_aJaEcBKK5KXRP9AK'),
(235, 37, 'https://drive.google.com/uc?export=view&id=1xD_acSLvQaDCIFni9rdiPaSdcgtlwftl'),
-- Hotel 7 Room 38: Family Connecting
(236, 38, 'https://drive.google.com/uc?export=view&id=1QWXXgfs0po8fxhRqTT4lAa6xph3L_Cbq'),
(237, 38, 'https://drive.google.com/uc?export=view&id=1YxIRsqwZLmUFRQ_gYsW-ANs3puIZvQi5'),
(238, 38, 'https://drive.google.com/uc?export=view&id=1GuGakwplNQu8cGMtANzcjad4ZNl7mF8h'),
(239, 38, 'https://drive.google.com/uc?export=view&id=1Ksqo7sqYgT8-AfiglP8RtIVWJRLYXcIB'),
(240, 38, 'https://drive.google.com/uc?export=view&id=10JolFcx3ExrJuq1Pqzj-SgbSrLorkqN5'),
(241, 38, 'https://drive.google.com/uc?export=view&id=1gPpdtWG9oDliZQQpNP__N8Q1a_G3c0J7'),
-- Hotel 8 Room 39: Deluxe
(242, 39, 'https://drive.google.com/uc?export=view&id=13aDVeMlE4fVTS07ptZJ6Cu1njVYhARDg'),
(243, 39, 'https://drive.google.com/uc?export=view&id=1gIuxxeiFzCYe6aOXTgUXNQe01EQY_VsK'),
(244, 39, 'https://drive.google.com/uc?export=view&id=1b3dzbRW4wo80DM9bVA7aNcK5gCzGuQNy'),
(245, 39, 'https://drive.google.com/uc?export=view&id=14LB6O0TCbSibnkI9n_hE0HlmzJ-lcW9w'),
(246, 39, 'https://drive.google.com/uc?export=view&id=1Ahywqu4xhnc_4s4Yvm_nlwucDKcEsh-y'),
(247, 39, 'https://drive.google.com/uc?export=view&id=1Y-8otieCjr7KvWDLqXHuFsQSJket6KaI'),
(248, 39, 'https://drive.google.com/uc?export=view&id=15H33jrdNE7neyxvJGIxUj7ePd9LhigPB'),
(249, 39, 'https://drive.google.com/uc?export=view&id=1jq54zSuPfLJlTVlcXVMCYLN6eQHY6mUJ'),
(250, 39, 'https://drive.google.com/uc?export=view&id=1aE1qceQbfQJ-DWur4I2Y6cUvx5TauUMk'),
(251, 39, 'https://drive.google.com/uc?export=view&id=1y6sTlyzDyJo8_LQWebKjT9KtpM34p3FH'),
(252, 39, 'https://drive.google.com/uc?export=view&id=1Frl_DNZx3T2qQAC9V6rXYKRsfs62Xwu3'),
(253, 39, 'https://drive.google.com/uc?export=view&id=1n1z92a3rCTZ792NaQ0bUmoZB8RayW2bp'),
(254, 39, 'https://drive.google.com/uc?export=view&id=1CVAmYL9uBFJUeIqsAG42Ye8-71JXmUGJ'),
(255, 39, 'https://drive.google.com/uc?export=view&id=10LmaHwCdmi9AFoqrf8kF2Aog6G81BJ6u'),
(256, 39, 'https://drive.google.com/uc?export=view&id=17FCT9jNACTqVJ-eQjJYH5DZVwdsc6HBL'),
(257, 39, 'https://drive.google.com/uc?export=view&id=1FbFOMYJtAVEAyA6cH1um3muuZeRWOnsR'),
(258, 39, 'https://drive.google.com/uc?export=view&id=1iyHw3Gsov1UajwBKQje7i4XvjfF54Agc'),
(259, 39, 'https://drive.google.com/uc?export=view&id=12vP1uKxPCd-C7R_qRtlTdzv7stoJs-mX'),
(260, 39, 'https://drive.google.com/uc?export=view&id=1NMmQy7yDI8sga0yUwFeIW-YCqXMef9zz'),
(261, 39, 'https://drive.google.com/uc?export=view&id=11v8K9lHx5zKZOJP6Gu6xJUvk4tr0wv8z2'),
(262, 39, 'https://drive.google.com/uc?export=view&id=1M-RZ5iVaEqBOdz2f2xzHa9MDIORk-rSB'),
(263, 39, 'https://drive.google.com/uc?export=view&id=1mS3gUrDjtiI213BdgLM8ULvClaUsGUNm'),
(264, 39, 'https://drive.google.com/uc?export=view&id=1LrtZ7a-L7o_r-rrbTe61_RThyT1t7c_U'),
-- Hotel 8 Room 40: Junior Double Room
(265, 40, 'https://drive.google.com/uc?export=view&id=157a51WRQfLaxX3oHqj9rURoEp0S7eyuC'),
(266, 40, 'https://drive.google.com/uc?export=view&id=101BtsIlE9luLhGid87FlUrgxhmSyJ-Zq'),
(267, 40, 'https://drive.google.com/uc?export=view&id=1XxW3csd7eXDEykAv7x_Zw_YwSY-B6enX'),
(268, 40, 'https://drive.google.com/uc?export=view&id=1RLATsn0tkmpkTENf7m_nJndOoc8hBj5M'),
(269, 40, 'https://drive.google.com/uc?export=view&id=1BB9z_kCJHkLXRhELemrR774SQPuzC44w'),
(270, 40, 'https://drive.google.com/uc?export=view&id=1Rw3bR-w-EL4bc7FDkJgcrXfG_JyYbVmG'),
(271, 40, 'https://drive.google.com/uc?export=view&id=1fJDLzU4-1ByRupvA8zKXlRUYNdv0KwXv'),
(272, 40, 'https://drive.google.com/uc?export=view&id=1SHMXSfUdm9KqqCESvhobaxqJ2AkK7DzG'),
(273, 40, 'https://drive.google.com/uc?export=view&id=1nLtvX6UXDytfSibgRIU_We5q2DBzz3dr'),
(274, 40, 'https://drive.google.com/uc?export=view&id=1H5h7Ka245pYocvWc3sajfXh81-fTAS-z'),
(275, 40, 'https://drive.google.com/uc?export=view&id=1-7bNrdPoYnF3aohgSymqQ5Hhog_N-6mz'),
(276, 40, 'https://drive.google.com/uc?export=view&id=11ELAg6A95905d64i7Z0wtQ8UMQb6JbzJ'),
-- Hotel 8 Room 41: Executive Balcony Room
(277, 41, 'https://drive.google.com/uc?export=view&id=1tT9LSzB6zZM9dDYxT5b69cxZfK7b3T8j'),
(278, 41, 'https://drive.google.com/uc?export=view&id=1ELjjrjSq9CPrkTJFFWATJgBYzrBm4Ld8'),
(279, 41, 'https://drive.google.com/uc?export=view&id=1fHuzh-BytgET36w5KZES2a2KrHggTR3I'),
(280, 41, 'https://drive.google.com/uc?export=view&id=1qt-0ni10AyI8_GHF1A3YfSNNQtwUtp0I'),
(281, 41, 'https://drive.google.com/uc?export=view&id=1Xr-LrlT1gZCDdHfe8jVLpW2tJclMWunc'),
(282, 41, 'https://drive.google.com/uc?export=view&id=1q27aOXtk3mGCMftLY345sda72_2R_9cW'),
(283, 41, 'https://drive.google.com/uc?export=view&id=1k6Ta0FiH6XS_1izMe3GMwqT9gaX7CVm-'),
(284, 41, 'https://drive.google.com/uc?export=view&id=13LR70WcTEUXFrptXLZgJGU5w6LZtWCis'),
(285, 41, 'https://drive.google.com/uc?export=view&id=1E1POKb1zbJ4xOdzN4yZIwPF9QNfPUUn3'),
(286, 41, 'https://drive.google.com/uc?export=view&id=1tlbjpn5t6lR9TOTlU2AWQ6Sk6UvfWdf2'),
(287, 41, 'https://drive.google.com/uc?export=view&id=1sOPGjjN3UNrl0UasolZi3L03w-eOweBG'),
(288, 41, 'https://drive.google.com/uc?export=view&id=1wFxDtELKTZkXRhfPMXxaUUlHTtRZAwDz'),
(289, 41, 'https://drive.google.com/uc?export=view&id=1ogkiWACNBxlaZexLydj8NDvtAl4BJH0q'),
-- Hotel 8 Room 42: Executive City View Room
(290, 42, 'https://drive.google.com/uc?export=view&id=1MOKNBjXl3L1tiF3lteeUMmWbVZiEiE5P'),
(291, 42, 'https://drive.google.com/uc?export=view&id=1lQYn3xsY7qOJ0a-6te53hgibTwAptnIH'),
(292, 42, 'https://drive.google.com/uc?export=view&id=1oGkvW5x5DIQMSvBTWqB6SA1RfmKaRbNc'),
(293, 42, 'https://drive.google.com/uc?export=view&id=11QrWfNFQ8mbMQSTiroleHhwEItWQxhE5'),
(294, 42, 'https://drive.google.com/uc?export=view&id=12RcGsmORHFi_ZKrQGJ48VtfcYArdrRzU'),
(295, 42, 'https://drive.google.com/uc?export=view&id=1WhLkxeY64uchLJStzaiWYV-vxDG4RTbk'),
(296, 42, 'https://drive.google.com/uc?export=view&id=1vU1vWdHXz1n6dyemkxSfupcb5zEortOx'),
(297, 42, 'https://drive.google.com/uc?export=view&id=1I8cbNaTA_MPwFp2g-OAE_Ov8fzAN_1de'),
(298, 42, 'https://drive.google.com/uc?export=view&id=1rue9ozij5RWTTA0z0EuPTuXfULn4dbhD'),
(299, 42, 'https://drive.google.com/uc?export=view&id=1Q1bph5g9C1fGPq_fVEvH3O3CDi5css11'),
(300, 42, 'https://drive.google.com/uc?export=view&id=1ozFJX8F7UxAq3RD6VY07DpArcrwve5Ab'),
(301, 42, 'https://drive.google.com/uc?export=view&id=1igLltGg0SX-mmP1cjPuiFP3SDxI0KPdW'),
(302, 42, 'https://drive.google.com/uc?export=view&id=1VwszlJAmmvviYupmsF_Pn4DTKbj5ZY5-'),
(303, 42, 'https://drive.google.com/uc?export=view&id=1sHJzkloYwJfOKQKxUmfoxgE8dA3Pg9x0'),
(304, 42, 'https://drive.google.com/uc?export=view&id=1y7KcEtNaysyPQNKwAaqNRI6z7QfHAv9t'),
(305, 42, 'https://drive.google.com/uc?export=view&id=1WwlsrDx_GMzafRzm058BVU-AczlLkRJa'),
(306, 42, 'https://drive.google.com/uc?export=view&id=1V7HCU-iGwriFFLJbVZLVLHyGoFl2JUWB'),
-- Hotel 8 Room 43: Family Room
(307, 43, 'https://drive.google.com/uc?export=view&id=1v-O-nbNtLdmnr_w8__AoaFNWj6KzQwY4'),
(308, 43, 'https://drive.google.com/uc?export=view&id=17Q7qkVBu76_q2dUwRCvAkIYiKNzAr3RZ'),
(309, 43, 'https://drive.google.com/uc?export=view&id=1Y8w6hm6a-68a22A3XjPzduwUlg5Y6Y7l'),
(310, 43, 'https://drive.google.com/uc?export=view&id=1kOJL2xnpq7fJJHDjJBrk99fnU4sPC4JW'),
(311, 43, 'https://drive.google.com/uc?export=view&id=1ZAqBfN2HMcn_crpwPww8OzAuUiQ-27Qa'),
(312, 43, 'https://drive.google.com/uc?export=view&id=11_iAGpK8SZZA88DOxWTVbrCUQkHbYfIc'),
(313, 43, 'https://drive.google.com/uc?export=view&id=1b4zIReIjeTMKYDb-Q7DMy2QWHcE9iill'),
(314, 43, 'https://drive.google.com/uc?export=view&id=1-wzzffG9S_cJ_kJxBBJAkME7ZJf2RMwz'),
(315, 43, 'https://drive.google.com/uc?export=view&id=1QgVR0OwfAouxB5OjD4Xpz3DsGwAswksR'),
-- Hotel 8 Room 44: Privilege Room
(316, 44, 'https://drive.google.com/uc?export=view&id=1O8zxXxSrvXhjPjjZkCjcn427CjvTP9rw'),
(317, 44, 'https://drive.google.com/uc?export=view&id=1KuGylg8FE3SwnA8eKORkRDa-lOSjl4Tg'),
(318, 44, 'https://drive.google.com/uc?export=view&id=1pucH4g3nUAhuN-WWtuEzEn9fQmcDfMJB'),
(319, 44, 'https://drive.google.com/uc?export=view&id=1xoBaL6WoRdRGg1ux5JDRvQjiHgaqTf-b'),
(320, 44, 'https://drive.google.com/uc?export=view&id=119KQ2JmnLgl1sqfhrXoaexkx4wEnx1MJ'),
(321, 44, 'https://drive.google.com/uc?export=view&id=1xXaUS3HP5BnpgYLd_z3gv9JvSoIe38lq'),
(322, 44, 'https://drive.google.com/uc?export=view&id=1DjTgBEIgpj4o3FyFbyVrcKri5D8ABKyI'),
(323, 44, 'https://drive.google.com/uc?export=view&id=1UTS9r0-VxAijFW66S_7NvBJjNF3BGaGS'),
(324, 44, 'https://drive.google.com/uc?export=view&id=14EazrTLDeGvhCStqkoWEjXadxw8lA2Qq'),
(325, 44, 'https://drive.google.com/uc?export=view&id=1BDQA9x_vZlfJp_MDsVyRwxb5m3rxBJSt'),
(326, 44, 'https://drive.google.com/uc?export=view&id=1DYJbicMXOQxGakaLTOk04ruHKqnAdlY9'),
(327, 44, 'https://drive.google.com/uc?export=view&id=1IYlTFMSMG_BdfIO5lJiHbtPabZSLrcwB'),
(328, 44, 'https://drive.google.com/uc?export=view&id=1CuHDZBjPFQuQErV8vSegxBNzNLh9lVls'),
(329, 44, 'https://drive.google.com/uc?export=view&id=1vz82gQp4GXsTwSO7Kj0EaB0u_2pSX6mt'),
(330, 44, 'https://drive.google.com/uc?export=view&id=1F3F7IxK2OdcKw7e2Q75sEdvPRMPN-vci'),
(331, 44, 'https://drive.google.com/uc?export=view&id=1gsIKYx2Dka_LLom0MTmjT7tXgY6cPPyu'),
(332, 44, 'https://drive.google.com/uc?export=view&id=14dS6RelB1DMe-qwTCwMed86aCARCd8eT'),
-- Hotel 8 Room 45: L Art Signature
(333, 45, 'https://drive.google.com/uc?export=view&id=1XPeyMZ3wngA10tbw5oZ_K77cFVLDiEYA'),
(334, 45, 'https://drive.google.com/uc?export=view&id=1jgSuaTuzN79J3_eLwgsvQ3CzedhyuzM_'),
-- Hotel 9 Room 46: Suite Balcony City View (Double)
(335, 46, 'https://drive.google.com/uc?export=view&id=105YCcFLuAjNUpF1Os5ixn8KF2wr1VfOS'),
(336, 46, 'https://drive.google.com/uc?export=view&id=17dzLhVIsQFcB8lBLTdPGQygZSTJw2HO2'),
(337, 46, 'https://drive.google.com/uc?export=view&id=1pQHuWs7sWpbf74tY0qmORBEg00AnTYsN'),
(338, 46, 'https://drive.google.com/uc?export=view&id=1xh6tSYAbBuONdCpB_htrcD2Rz_Xw_Glf'),
(339, 46, 'https://drive.google.com/uc?export=view&id=1z1Agi5MBNMXtPh6RlW2gG-RcBnYlQbpw'),
(340, 46, 'https://drive.google.com/uc?export=view&id=1Y6OZjOZKas11rBWqtndsP-wEahb7QDlR'),
(341, 46, 'https://drive.google.com/uc?export=view&id=1PFduR5nqQyN7untk-OsLsBMJSaCvyaDT'),
(342, 46, 'https://drive.google.com/uc?export=view&id=1zXIsOLJdxtKdMP50MTskOV7deW8ISjY7'),
(343, 46, 'https://drive.google.com/uc?export=view&id=174Nx-eNDvhmr-J9CxrpRY7BYE7MzXhyL'),
(344, 46, 'https://drive.google.com/uc?export=view&id=1g-dBF1JXKAYzSb8GCpUBwo-jswz7qSkL'),
(345, 46, 'https://drive.google.com/uc?export=view&id=1Ul9xLCcSpd5iQQAQYDlNZY1wenXZHa_3'),
(346, 46, 'https://drive.google.com/uc?export=view&id=1tS9xCTEbhzsTkHA1C4tlXJ8nbIlQiFuy'),
-- Hotel 9 Room 47: Suite Balcony City View (Twin)
(347, 47, 'https://drive.google.com/uc?export=view&id=1ZrONzU5SdfkyI6Y33jhHlUZLm40n4B5b'),
(348, 47, 'https://drive.google.com/uc?export=view&id=1_U0xOetqaY7WopNhG8_C4pp7PSFoGrgD'),
(349, 47, 'https://drive.google.com/uc?export=view&id=1UQC-c8xNFEbVwYH2JPrZKkXCjPQoTVyK'),
(350, 47, 'https://drive.google.com/uc?export=view&id=131vdw-jsW2XTF5uJlqn-SlMv5PvNtgrP'),
(351, 47, 'https://drive.google.com/uc?export=view&id=17A8rXdKoF-iZjdkuPKXUO9o2N7KiOnOL'),
(352, 47, 'https://drive.google.com/uc?export=view&id=1b6-ijwx87GMmowBFcLshUfd3x0rP7Cqo'),
(353, 47, 'https://drive.google.com/uc?export=view&id=1cUBP3M3YaKvWofrlmHWcrQ-sPfKsbvRE'),
(354, 47, 'https://drive.google.com/uc?export=view&id=1cmoSl84MLVwpps8E4UbHKgja2pcwVEL1'),
-- Hotel 9 Room 48: Executive Suite Lake View
(355, 48, 'https://drive.google.com/uc?export=view&id=1F--xQCIQKNgUJisch4mUgC5bPQsQhJ6n'),
(356, 48, 'https://drive.google.com/uc?export=view&id=1svN0Pu7YpnKMplxIE6Pc5wLaupBYotl0'),
(357, 48, 'https://drive.google.com/uc?export=view&id=1yUHtvNF5eRJiJbDwJnG7sHTIFFbnO7o9'),
-- Hotel 10 Room 49: Deluxe DBL/TWN with Window
(358, 49, 'https://drive.google.com/uc?export=view&id=1Vi5X8GsnTexf25-QijE2QOeFBDocFRxS'),
(359, 49, 'https://drive.google.com/uc?export=view&id=1BMl51VvMn7dG9B-LFxZGzHBzcAi9eWMJ'),
(360, 49, 'https://drive.google.com/uc?export=view&id=1ASuD2T1uBkYQJg6UfQUWc9wgBFv519Zs'),
(361, 49, 'https://drive.google.com/uc?export=view&id=1PMsNyPn_ZK9jj2ke6oL-XuokTeogHDU4'),
-- Hotel 10 Room 50: Premium City View
(362, 50, 'https://drive.google.com/uc?export=view&id=14P_D0a4evbhRBSDiF4v045vzVGC0oS7f'),
(363, 50, 'https://drive.google.com/uc?export=view&id=1VsS2CkJj-n2lstiaLof0ezEO0F2kw2de'),
(364, 50, 'https://drive.google.com/uc?export=view&id=12p4gaKKs90FsjAMLuQACwiGDYJ_9jVkh'),
(365, 50, 'https://drive.google.com/uc?export=view&id=1PBisV2lgqaW3N1_9bNnoKVppbbZamwee'),
-- Hotel 10 Room 51: Executive Balcony
(366, 51, 'https://drive.google.com/uc?export=view&id=1-_PRmkol90RIsD-7R4saIfjemAe1p0cU'),
(367, 51, 'https://drive.google.com/uc?export=view&id=1TWbuX_LVlT-GFrD3rpu5-fQffrC6Kp-S'),
(368, 51, 'https://drive.google.com/uc?export=view&id=1A7wAaq4XrNORZLX1eKsnSqCpQHm1hurP'),
(369, 51, 'https://drive.google.com/uc?export=view&id=1PrCRA59r8fJ84dejDP-K7pPRyFhX0dXg'),
(370, 51, 'https://drive.google.com/uc?export=view&id=16Fpp1iRSnPvoCYoIVpF8C8wmNKxTBgzp'),
(371, 51, 'https://drive.google.com/uc?export=view&id=1ldVUE6GjDPWWgBYw2C9lpEt8ORRlDbUb'),
-- Hotel 10 Room 52: Family City View
(372, 52, 'https://drive.google.com/uc?export=view&id=1T8aoH9ZmyjJD32ax5NMQqMYOoa-ZNK7i'),
(373, 52, 'https://drive.google.com/uc?export=view&id=1NojcacOeBfE7a2bk6wWfqsoOU6qYto9L'),
(374, 52, 'https://drive.google.com/uc?export=view&id=12YulBoR05xwhjKd4f1l1BuBMWzZi7hXY'),
-- Hotel 11 Room 53: Deluxe Double with Window
(375, 53, 'https://drive.google.com/uc?export=view&id=1FZvg4IGGrIj74vNct5FUdThSD9Uzwbvt'),
(376, 53, 'https://drive.google.com/uc?export=view&id=1TLxKUUE88HI5OQevF_Z9CxpaB3Ow3qQz'),
(377, 53, 'https://drive.google.com/uc?export=view&id=1WwEKg4V38a8pXYNTWoimrFhN1nJ0nmAE'),
-- Hotel 11 Room 54: Premium with Balcony
(378, 54, 'https://drive.google.com/uc?export=view&id=1YVCUAEOqVLUIQcsm1GHO8tgs5JWZocXG'),
(379, 54, 'https://drive.google.com/uc?export=view&id=1uffov7OooGmx8STduiJFti5N01q6sAuL'),
(380, 54, 'https://drive.google.com/uc?export=view&id=1yemH4pLWsWrImhHK0nCoYfBgZG_OceJV'),
(381, 54, 'https://drive.google.com/uc?export=view&id=1oeC5VzBtBCsyIEGeB6ADPqr23GSJ4Nam'),
(382, 54, 'https://drive.google.com/uc?export=view&id=1N2-BsdbWw3k7GohABu0RgqrSoiLV4x7e'),
(383, 54, 'https://drive.google.com/uc?export=view&id=1AeUPCve_m8FAw9a1sY_25NENlhAaJyV2'),
-- Hotel 11 Room 55: Executive with Balcony
(384, 55, 'https://drive.google.com/uc?export=view&id=1Qls2-vrPousVkluAH6FwjOolNeDe4RCA'),
(385, 55, 'https://drive.google.com/uc?export=view&id=1yGiq4k7sATbnsNvVahEPPfF1eGBE2WuB'),
(386, 55, 'https://drive.google.com/uc?export=view&id=1Msms9OPzQTHId5y4g2QSRgQMORzi6DFX'),
(387, 55, 'https://drive.google.com/uc?export=view&id=1j9niXUlTThtxRRE7A8PAPdstBY_4wWsd'),
(388, 55, 'https://drive.google.com/uc?export=view&id=1_sDvTw8MoUh5zDX1I44O1Xzc0b3q-aDt'),
-- Hotel 11 Room 56: Family Balcony Room
(389, 56, 'https://drive.google.com/uc?export=view&id=19NkDGPNeMI64XO6YJn-fcGZskbza43wC'),
(390, 56, 'https://drive.google.com/uc?export=view&id=1YPZ7Y7HoyyY50QLzO8Bk92EV1TFj3EP3'),
(391, 56, 'https://drive.google.com/uc?export=view&id=1HVf_Sb_ASPFqtwGRPYtSfveevqLddfeB'),
-- Hotel 12 Room 57: Standard Double Room
(392, 57, 'https://drive.google.com/uc?export=view&id=1S71oSDdKR_-Vaj7xUupTdrlEQfq9zn6P'),
(393, 57, 'https://drive.google.com/uc?export=view&id=1-onw9zP5aeybg2p2644APGLKhXxYJkji'),
(394, 57, 'https://drive.google.com/uc?export=view&id=1b4aFq5TbeFyxQf61CwurLal0TE9bdd0x'),
(395, 57, 'https://drive.google.com/uc?export=view&id=1MMFVrYpssBTU2CYEZOlXvm-qNgweUTdp'),
-- Hotel 12 Room 58: Executive Triple Room
(396, 58, 'https://drive.google.com/uc?export=view&id=1Oy8tlCfoJyoj2lwpPbuwNkSyVbRuZ-2z'),
(397, 58, 'https://drive.google.com/uc?export=view&id=1Ea6Yk9oq44cfY-p1dhCpBxNueY0D0S0h'),
(398, 58, 'https://drive.google.com/uc?export=view&id=17r6Y4hbGCdCC_cjAEo6G2WPOzao3DL4K'),
(399, 58, 'https://drive.google.com/uc?export=view&id=1Hbz2HQfrVZcBS0kbFruZWU9BYsRdGPH6'),
(400, 58, 'https://drive.google.com/uc?export=view&id=1GMkq-o1ASqHrrNQYDUZKJ16qUaEE5Hjl'),
-- Hotel 12 Room 59: Family Suite Balcony (dùng ảnh suite with balcony vì không có riêng)
(401, 59, 'https://drive.google.com/uc?export=view&id=1uV4JtOq7a0Kh1HkKKpp8E59j4YvjYGAB'),
(402, 59, 'https://drive.google.com/uc?export=view&id=1uYSxmPRzTCCdIqDXEOddn7PUnOXzyxoI'),
(403, 59, 'https://drive.google.com/uc?export=view&id=1LVfa7zX4tSgWGjgUx2jT53IIzhURUHGl'),
-- Hotel 12 Room 60: King Room with Lake View
(404, 60, 'https://drive.google.com/uc?export=view&id=14GdFm39q4WGqCiUFO9QbX_qm_vMHb30z'),
(405, 60, 'https://drive.google.com/uc?export=view&id=1qNujXpmNgm_OySbw2tSigS_UbpSOCenw'),
(406, 60, 'https://drive.google.com/uc?export=view&id=1dhoO3jUI-wen1Y0bLZVTV0IQZ38X4Ub1'),
(407, 60, 'https://drive.google.com/uc?export=view&id=16imEs-X9hlh8aJg53gjoI9VFMJZASIoh'),
-- Hotel 12 Room 61: Suite With Balcony
(408, 61, 'https://drive.google.com/uc?export=view&id=1uV4JtOq7a0Kh1HkKKpp8E59j4YvjYGAB'),
(409, 61, 'https://drive.google.com/uc?export=view&id=1uYSxmPRzTCCdIqDXEOddn7PUnOXzyxoI'),
(410, 61, 'https://drive.google.com/uc?export=view&id=1LVfa7zX4tSgWGjgUx2jT53IIzhURUHGl'),
(411, 61, 'https://drive.google.com/uc?export=view&id=1YMyYNHUcILDhRBQ9BqHbgvTD5Gak8wh2'),
(412, 61, 'https://drive.google.com/uc?export=view&id=1JGYK-79ibyYhO27c96jjX_OcFS39XfCg'),
(413, 61, 'https://drive.google.com/uc?export=view&id=1PMaD4Da-dIxSHVwWrXxqigywf579vazF'),
-- Hotel 13 Room 62: Deluxe Double Room
(414, 62, 'https://drive.google.com/uc?export=view&id=1-oMLSaCLJJK67_SRVo-zjAmt64tnptOl'),
(415, 62, 'https://drive.google.com/uc?export=view&id=1WozHeHg1Lk7EDEXuE9zBD2wTVtRNNfD2'),
(416, 62, 'https://drive.google.com/uc?export=view&id=1PIVZryzTKMEca4nI2QMLOXOplhXwZ70x'),
(417, 62, 'https://drive.google.com/uc?export=view&id=1goYAmd9XLZ5Czbr_iNxCeqv3nMqGgewt'),
(418, 62, 'https://drive.google.com/uc?export=view&id=12AAt7GPNwvU9Kws5tJSR14A-KkMYTlOW'),
(419, 62, 'https://drive.google.com/uc?export=view&id=1gLvpc-Tn_ky_522wxIQAfP_BQflgvx1d'),
(420, 62, 'https://drive.google.com/uc?export=view&id=1Nr99ggQtu9zjIZKkpanQ4MLsvlmttIxG'),
-- Hotel 13 Room 63: Deluxe Twin Room
(421, 63, 'https://drive.google.com/uc?export=view&id=1K-d1JHtjjaI2rZA_wCmp2esTBNCJ-9er'),
(422, 63, 'https://drive.google.com/uc?export=view&id=1bl61sv1BY-bT0N_ZaaUold7xcpg6wFq9'),
(423, 63, 'https://drive.google.com/uc?export=view&id=1H9U7WI2ki22Sm8QpFaIIqKOas4m9Kdr5'),
(424, 63, 'https://drive.google.com/uc?export=view&id=1hIpnLTBe3ncAdId1dMdm94Es333oWutC'),
-- Hotel 13 Room 64: Suite City View Room
(425, 64, 'https://drive.google.com/uc?export=view&id=1cBLoULaVqkT-HvybsPPhS_TrCoJghoue'),
(426, 64, 'https://drive.google.com/uc?export=view&id=1881xjiPGjpM36VbF1c9lfD9zcVkbKh9I'),
(427, 64, 'https://drive.google.com/uc?export=view&id=1OmM5WE7vx7JKqIO6OYsM-wZ0bDnxw6n5'),
(428, 64, 'https://drive.google.com/uc?export=view&id=1cVYmTyfzKKYKvkCijeBZGTIDWcsruYeM'),
(429, 64, 'https://drive.google.com/uc?export=view&id=1_6SrmiEPelPZ5fdcvJ3nG1ZKZUjpU9kg'),
(430, 64, 'https://drive.google.com/uc?export=view&id=1iZdPMfEaKUNcZvv5jbmo0FkHVXv9mQ1-'),
(431, 64, 'https://drive.google.com/uc?export=view&id=1UhCsxgeD4JNdJDG8VDJrjhNlMCmVgvLS'),
-- Hotel 13 Room 65: Suite Balcony Room
(432, 65, 'https://drive.google.com/uc?export=view&id=1aEsqk9208qwwqLwrLKghPseuvw6D_Y_V'),
(433, 65, 'https://drive.google.com/uc?export=view&id=1rMm7pyjvlST_IYK3rh28mj84yl-NrUoW'),
(434, 65, 'https://drive.google.com/uc?export=view&id=1hYuwBeHk5mTaqxyv4CrZc-FcdWFWuH-6'),
(435, 65, 'https://drive.google.com/uc?export=view&id=1CnHLLnt7df069okdsDp6bDNGpwOTg__0'),
(436, 65, 'https://drive.google.com/uc?export=view&id=1gbFmYK1pQQkAJzwYYtp2GptGDem7Pzra'),
(437, 65, 'https://drive.google.com/uc?export=view&id=1zZbDDfX3qwpGs6tqdQFBDjudO9GIdeSm'),
-- Hotel 13 Room 66: Family Suite City View Room
(438, 66, 'https://drive.google.com/uc?export=view&id=1xyWtKxi2k_F9EYvJynfo19-MYxKIjdp2'),
(439, 66, 'https://drive.google.com/uc?export=view&id=11nHqpCcrBYPKBK8SGcV45QxKfAsGC2pV'),
(440, 66, 'https://drive.google.com/uc?export=view&id=1-odS6ECwCljUfQ_PqzwUC4kl7AwMJgOc'),
(441, 66, 'https://drive.google.com/uc?export=view&id=1cLI28oxxjGOsCvDiDueWZiH8_mXFzCzv')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 5. BOOKINGS (13 bản ghi, 1 per hotel)
-- ==========================================
INSERT INTO bookings (id, user_id, hotel_id, check_in_date, check_out_date, total_price, status, payment_status, created_at) VALUES
(1,  1,  1,  '2026-06-01', '2026-06-03', 2400000,  'CONFIRMED', 'PAID',     NOW()),
(2,  2,  2,  '2026-06-05', '2026-06-07', 3600000,  'CONFIRMED', 'PAID',     NOW()),
(3,  3,  3,  '2026-06-10', '2026-06-12', 3200000,  'PENDING',   'UNPAID',   NOW()),
(4,  4,  4,  '2026-06-15', '2026-06-17', 2800000,  'CONFIRMED', 'PAID',     NOW()),
(5,  5,  5,  '2026-06-20', '2026-06-22', 3000000,  'CANCELLED', 'REFUNDED', NOW()),
(6,  6,  6,  '2026-07-01', '2026-07-03', 2600000,  'CONFIRMED', 'PAID',     NOW()),
(7,  7,  7,  '2026-07-10', '2026-07-12', 3400000,  'CONFIRMED', 'PAID',     NOW()),
(8,  8,  8,  '2026-07-15', '2026-07-17', 4000000,  'PENDING',   'UNPAID',   NOW()),
(9,  9,  9,  '2026-07-20', '2026-07-22', 7000000,  'CONFIRMED', 'PAID',     NOW()),
(10, 10, 10, '2026-08-01', '2026-08-03', 3800000,  'CONFIRMED', 'PAID',     NOW()),
(11, 11, 11, '2026-08-05', '2026-08-07', 3200000,  'CONFIRMED', 'PAID',     NOW()),
(12, 12, 12, '2026-08-10', '2026-08-12', 2200000,  'CONFIRMED', 'PAID',     NOW()),
(13, 13, 13, '2026-08-15', '2026-08-17', 3600000,  'CONFIRMED', 'PAID',     NOW())
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 6. BOOKING_ROOMS (13 bản ghi)
-- ==========================================
INSERT INTO booking_rooms (id, booking_id, room_id, quantity, price) VALUES
(1,  1,  1,  1, 1200000),
(2,  2,  9,  1, 1800000),
(3,  3,  15, 1, 1600000),
(4,  4,  19, 1, 1400000),
(5,  5,  25, 1, 1500000),
(6,  6,  29, 1, 1300000),
(7,  7,  35, 1, 1700000),
(8,  8,  39, 1, 2000000),
(9,  9,  46, 1, 3500000),
(10, 10, 49, 1, 1900000),
(11, 11, 53, 1, 1600000),
(12, 12, 57, 1, 1100000),
(13, 13, 62, 1, 1800000)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 7. BOOKING_REQUEST (13 bản ghi)
-- ==========================================
INSERT INTO booking_request (id, booking_id, type, new_check_in, new_check_out, status, created_at, processed_at, processed_by) VALUES
(1,  1,  'CHANGE_DATE', '2026-06-10 14:00:00', '2026-06-13 12:00:00', 'PENDING',  '2026-05-12 20:00:00', NULL,                  NULL),
(2,  2,  'CANCEL',      NULL,                   NULL,                  'APPROVED', '2026-05-10 09:00:00', '2026-05-11 10:30:00', 1),
(3,  3,  'CHANGE_DATE', '2026-06-15 14:00:00', '2026-06-17 12:00:00', 'REJECTED', '2026-05-11 15:20:00', '2026-05-12 09:00:00', 1),
(4,  4,  'CANCEL',      NULL,                   NULL,                  'PENDING',  '2026-05-13 08:15:00', NULL,                  NULL),
(5,  5,  'CHANGE_DATE', '2026-06-22 14:00:00', '2026-06-24 12:00:00', 'APPROVED', '2026-05-09 10:00:00', '2026-05-09 14:00:00', 1),
(6,  6,  'CHANGE_DATE', '2026-07-03 14:00:00', '2026-07-06 12:00:00', 'PENDING',  '2026-05-12 21:00:00', NULL,                  NULL),
(7,  7,  'CANCEL',      NULL,                   NULL,                  'REJECTED', '2026-05-08 11:00:00', '2026-05-08 16:00:00', 1),
(8,  8,  'CHANGE_DATE', '2026-07-20 14:00:00', '2026-07-22 12:00:00', 'APPROVED', '2026-05-07 09:30:00', '2026-05-07 11:30:00', 1),
(9,  9,  'CANCEL',      NULL,                   NULL,                  'PENDING',  '2026-05-13 09:25:00', NULL,                  NULL),
(10, 10, 'CHANGE_DATE', '2026-08-05 14:00:00', '2026-08-07 12:00:00', 'PENDING',  '2026-05-12 22:15:00', NULL,                  NULL),
(11, 11, 'CHANGE_DATE', '2026-08-10 14:00:00', '2026-08-12 12:00:00', 'REJECTED', '2026-05-05 14:00:00', '2026-05-06 09:00:00', 1),
(12, 12, 'CANCEL',      NULL,                   NULL,                  'APPROVED', '2026-05-06 10:00:00', '2026-05-06 15:00:00', 1),
(13, 13, 'CHANGE_DATE', '2026-08-18 14:00:00', '2026-08-20 12:00:00', 'PENDING',  '2026-05-13 01:30:00', NULL,                  NULL)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 8. REVIEWS (13 bản ghi)
-- ==========================================
INSERT INTO reviews (id, user_id, hotel_id, rating, comment, created_at) VALUES
(1,  1,  1,  5, 'Rooftop bar view hồ Hoàn Kiếm tuyệt đẹp, dịch vụ xuất sắc!',          NOW()),
(2,  2,  2,  5, 'Spa rất chuyên nghiệp, phòng sạch sẽ và sang trọng.',                  NOW()),
(3,  3,  3,  4, 'Vị trí đắc địa giữa phố cổ, nhân viên thân thiện.',                    NOW()),
(4,  4,  4,  5, 'Phong cách lịch lãm, đúng như tên gọi Classy.',                        NOW()),
(5,  5,  5,  4, 'Yên tĩnh, thoải mái, rất phù hợp để nghỉ ngơi.',                      NOW()),
(6,  6,  6,  5, 'Kiến trúc Ý đẹp mắt, phòng rộng rãi và thoáng mát.',                  NOW()),
(7,  7,  7,  4, 'Khách sạn cao cấp, view thành phố từ phòng rất đẹp.',                  NOW()),
(8,  8,  8,  5, 'Phong cách nghệ thuật độc đáo, trải nghiệm không giống nơi nào.',      NOW()),
(9,  9,  9,  5, 'Suite ban công nhìn thẳng ra hồ Hoàn Kiếm, tuyệt vời!',                NOW()),
(10, 10, 10, 4, 'San Palace xứng đáng với tên gọi, dịch vụ rất chuyên nghiệp.',        NOW()),
(11, 11, 11, 4, 'Boutique nhỏ xinh, ấm cúng và có hồn, giá hợp lý.',                   NOW()),
(12, 12, 12, 4, 'Ở giữa phố cổ, đi bộ đến mọi nơi tiện lợi.',                         NOW()),
(13, 13, 13, 5, 'Casa Valentina như ngôi nhà thứ hai, ấm áp và sang trọng.',            NOW())
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 9. BỔ SUNG reason & admin_response cho booking_request
-- ==========================================
UPDATE booking_request SET reason = 'Tôi muốn đổi ngày do có việc đột xuất',          admin_response = NULL                                        WHERE id = 1;
UPDATE booking_request SET reason = 'Kế hoạch thay đổi, không thể đi được',           admin_response = 'Yêu cầu hủy đã được chấp nhận.'            WHERE id = 2;
UPDATE booking_request SET reason = 'Muốn ở thêm 2 đêm cho chuyến đi dài hơn',       admin_response = 'Phòng không còn trống trong khoảng thời gian yêu cầu.' WHERE id = 3;
UPDATE booking_request SET reason = 'Công việc bị hủy, không thể đến được',           admin_response = NULL                                        WHERE id = 4;
UPDATE booking_request SET reason = 'Đổi ngày để phù hợp với lịch bay',               admin_response = 'Đã cập nhật ngày đặt phòng theo yêu cầu.'   WHERE id = 5;
UPDATE booking_request SET reason = 'Muốn kéo dài kỳ nghỉ thêm vài ngày',            admin_response = NULL                                        WHERE id = 6;
UPDATE booking_request SET reason = 'Có việc gia đình đột xuất cần hủy',              admin_response = 'Booking đã ở trạng thái CONFIRMED, không thể hủy.' WHERE id = 7;
UPDATE booking_request SET reason = 'Lịch hội nghị thay đổi, cần dời ngày nhận phòng', admin_response = 'Đã xác nhận thay đổi ngày theo yêu cầu.'  WHERE id = 8;
UPDATE booking_request SET reason = 'Không sắp xếp được thời gian, cần hủy đặt phòng', admin_response = NULL                                       WHERE id = 9;
UPDATE booking_request SET reason = 'Muốn đổi sang tuần sau cho tiện hơn',            admin_response = NULL                                        WHERE id = 10;
UPDATE booking_request SET reason = 'Bay sớm hơn dự kiến, cần đổi ngày check-in',    admin_response = 'Phòng đã có khách trong khoảng thời gian yêu cầu.' WHERE id = 11;
UPDATE booking_request SET reason = 'Toàn bộ nhóm không thể tham gia chuyến đi',     admin_response = 'Đã hủy booking và hoàn tiền theo chính sách.' WHERE id = 12;
UPDATE booking_request SET reason = 'Muốn tận hưởng kỳ nghỉ lâu hơn',               admin_response = NULL                                        WHERE id = 13;

-- ==========================================
-- 10. BỔ SUNG image_url cho hotels
-- ==========================================
UPDATE hotels SET image_url = 'https://drive.google.com/uc?export=view&id=1ND8OEQNNYKE6ijaupy2YZswNdOluriuY' WHERE id = 1;
UPDATE hotels SET image_url = 'https://drive.google.com/uc?export=view&id=1qONS4s11QZMGV7qldVKoLk_z6VURDBTb' WHERE id = 2;
UPDATE hotels SET image_url = 'https://drive.google.com/uc?export=view&id=1eckT7SLaBlxEl3CEwZ7jLTYT15yt_TbK' WHERE id = 3;
UPDATE hotels SET image_url = 'https://drive.google.com/uc?export=view&id=1c_jwvjPZjt0OBZWV2NG5DQGNomzBdEuD' WHERE id = 4;
UPDATE hotels SET image_url = 'https://drive.google.com/uc?export=view&id=11uJ1HLMyKjOuT-be4_-0Ui7xNUnrrk3n' WHERE id = 5;
UPDATE hotels SET image_url = 'https://drive.google.com/uc?export=view&id=1sPlAhyMwddvm0aaKNaBX5t777E3BTOi3' WHERE id = 6;
UPDATE hotels SET image_url = 'https://drive.google.com/uc?export=view&id=138d3cVjUQVrmsTDvl8iuPKBgCPjcrps9' WHERE id = 7;
UPDATE hotels SET image_url = 'https://drive.google.com/uc?export=view&id=13aDVeMlE4fVTS07ptZJ6Cu1njVYhARDg' WHERE id = 8;
UPDATE hotels SET image_url = 'https://drive.google.com/uc?export=view&id=1qDUXUNLkIExsiegQrAJSlbrNRmvLpxzt' WHERE id = 9;
UPDATE hotels SET image_url = 'https://drive.google.com/uc?export=view&id=1sx8dbre7KWSWJVV0zqQfgDmfhUHhpWqH' WHERE id = 10;
UPDATE hotels SET image_url = 'https://drive.google.com/uc?export=view&id=1tzJZvI22T1mZI4fsnCAFKgYhO6mHPcla' WHERE id = 11;
UPDATE hotels SET image_url = 'https://drive.google.com/uc?export=view&id=1sx8dbre7KWSWJVV0zqQfgDmfhUHhpWqH' WHERE id = 12;
UPDATE hotels SET image_url = 'https://drive.google.com/uc?export=view&id=1AVYAfSD7FXPrJvQRdQfR_42gDzPCTZeV' WHERE id = 13;

-- ==========================================
-- 11. NOTIFICATIONS (10 bản ghi mẫu)
-- ==========================================
INSERT INTO notifications (id, user_id, title, message, is_read, created_at) VALUES
(1,  2,  'Booking đã được duyệt',    'Booking #1 của bạn tại Lucien Hanoi đã được xác nhận.',              false, NOW()),
(2,  3,  'Booking đã được duyệt',    'Booking #3 của bạn tại Hanoi Emerald Waters đã được xác nhận.',      false, NOW()),
(3,  4,  'Booking bị từ chối',       'Booking #4 của bạn tại Hotel Emerald Waters Classy bị từ chối.',     true,  NOW()),
(4,  5,  'Yêu cầu đổi ngày thành công', 'Ngày đặt phòng booking #5 đã được cập nhật theo yêu cầu.',       false, NOW()),
(5,  6,  'Booking đã được duyệt',    'Booking #6 của bạn tại Hanoi Dalvostro Valentino đã được xác nhận.',false, NOW()),
(6,  7,  'Thanh toán thành công',    'Thanh toán cho booking #7 tại San Premium Hotel đã được xác nhận.',  true,  NOW()),
(7,  8,  'Yêu cầu hủy bị từ chối',  'Yêu cầu hủy booking #8 không được chấp nhận vì booking đã confirmed.', false, NOW()),
(8,  9,  'Booking đã được duyệt',    'Booking #9 của bạn tại La Belle Maison đã được xác nhận.',           true,  NOW()),
(9,  10, 'Thanh toán thành công',    'Thanh toán cho booking #10 tại San Palace Hotel đã được xác nhận.',  false, NOW()),
(10, 11, 'Booking đã được duyệt',    'Booking #11 của bạn tại San Boutique Hotel đã được xác nhận.',       false, NOW())
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 12. ĐỒNG BỘ SEQUENCE
-- ==========================================
SELECT setval('users_id_seq',          (SELECT MAX(id) FROM users));
SELECT setval('hotels_id_seq',         (SELECT MAX(id) FROM hotels));
SELECT setval('rooms_id_seq',          (SELECT MAX(id) FROM rooms));
SELECT setval('room_image_id_seq',     (SELECT MAX(id) FROM room_image));
SELECT setval('bookings_id_seq',       (SELECT MAX(id) FROM bookings));
SELECT setval('booking_rooms_id_seq',  (SELECT MAX(id) FROM booking_rooms));
SELECT setval('booking_request_id_seq',(SELECT MAX(id) FROM booking_request));
SELECT setval('reviews_id_seq',        (SELECT MAX(id) FROM reviews));
SELECT setval('notifications_id_seq',  COALESCE((SELECT MAX(id) FROM notifications), 1));