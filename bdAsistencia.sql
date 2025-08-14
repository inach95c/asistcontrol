-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: sistema_examenes_spring_boot
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `asistencia`
--

DROP TABLE IF EXISTS `asistencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `fecha` date NOT NULL,
  `hora_entrada` time NOT NULL,
  `hora_salida` time NOT NULL,
  `estado` enum('Presente','Ausente','Tardío') COLLATE utf8mb4_general_ci DEFAULT 'Presente',
  `horas_extras` int DEFAULT '0',
  `fecha_hora_entrada` time DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencia`
--

LOCK TABLES `asistencia` WRITE;
/*!40000 ALTER TABLE `asistencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `asistencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asistencias`
--

DROP TABLE IF EXISTS `asistencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencias` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fecha_hora` datetime DEFAULT NULL,
  `tipo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `usuario_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `asistencias_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencias`
--

LOCK TABLES `asistencias` WRITE;
/*!40000 ALTER TABLE `asistencias` DISABLE KEYS */;
INSERT INTO `asistencias` VALUES (1,'2025-06-25 08:37:25','ENTRADA',3),(2,'2025-06-25 08:37:33','ENTRADA',3),(3,'2025-06-25 08:40:56','SALIDA',3),(4,'2025-06-25 08:43:41','ENTRADA',25),(5,'2025-06-25 08:45:00','SALIDA',3),(6,'2025-06-25 15:29:26','SALIDA',25),(7,'2025-06-25 15:29:26','SALIDA',25),(8,'2025-06-25 15:29:26','SALIDA',25),(9,'2025-06-25 21:19:44','ENTRADA',3),(10,'2025-06-25 21:21:01','SALIDA',3),(11,'2025-06-25 21:25:51','ENTRADA',3),(12,'2025-06-25 21:26:11','SALIDA',3),(13,'2025-06-25 21:29:23','ENTRADA',3),(14,'2025-06-25 21:29:32','SALIDA',3),(15,'2025-06-25 22:08:39','ENTRADA',25),(16,'2025-06-25 22:08:46','SALIDA',25),(17,'2025-06-25 22:33:15','ENTRADA',25),(18,'2025-06-25 22:33:57','SALIDA',25),(19,'2025-06-25 22:37:18','SALIDA',3),(20,'2025-06-25 22:37:23','ENTRADA',3),(21,'2025-06-25 22:41:52','SALIDA',3),(22,'2025-06-25 22:41:58','SALIDA',3),(23,'2025-06-25 22:42:24','ENTRADA',3),(24,'2025-06-25 22:42:26','ENTRADA',3),(25,'2025-06-25 22:42:27','ENTRADA',3),(26,'2025-06-25 22:45:52','ENTRADA',3),(27,'2025-06-25 22:59:59','SALIDA',3),(28,'2025-06-25 23:16:39','ENTRADA',3),(29,'2025-06-25 23:16:41','ENTRADA',3),(30,'2025-06-25 23:17:11','ENTRADA',3),(31,'2025-06-25 23:17:20','ENTRADA',3),(32,'2025-06-25 23:18:35','ENTRADA',3),(33,'2025-06-25 23:18:50','SALIDA',3),(34,'2025-06-25 23:23:12','SALIDA',3),(35,'2025-06-25 23:23:27','ENTRADA',3),(36,'2025-06-25 23:23:39','SALIDA',3),(37,'2025-06-25 23:34:09','ENTRADA',26),(38,'2025-06-25 23:34:31','SALIDA',26),(39,'2025-06-25 23:49:58','ENTRADA',27),(40,'2025-06-26 00:07:43','ENTRADA',27),(41,'2025-06-26 00:08:28','SALIDA',27),(42,'2025-06-26 00:11:31','ENTRADA',3),(43,'2025-06-26 00:16:24','SALIDA',3),(44,'2025-06-26 00:25:10','ENTRADA',25),(45,'2025-06-26 06:45:29','SALIDA',25),(46,'2025-06-26 06:45:37','SALIDA',25),(47,'2025-06-26 07:33:09','ENTRADA',26),(48,'2025-06-26 11:28:17','SALIDA',26),(49,'2025-06-27 13:59:43','ENTRADA',3),(50,'2025-06-27 15:01:16','SALIDA',3),(51,'2025-06-27 23:12:32','ENTRADA',26),(52,'2025-06-27 23:12:43','SALIDA',26),(53,'2025-06-27 23:19:44','ENTRADA',28),(54,'2025-06-27 23:21:02','SALIDA',28),(55,'2025-06-28 00:42:33','ENTRADA',10),(56,'2025-06-28 00:42:34','ENTRADA',10),(57,'2025-06-28 00:43:00','SALIDA',10),(58,'2025-06-28 00:43:01','SALIDA',10),(59,'2025-06-28 00:43:01','SALIDA',10),(60,'2025-06-28 00:43:01','SALIDA',10),(61,'2025-06-28 07:53:55','ENTRADA',25),(62,'2025-06-28 07:53:59','SALIDA',25),(63,'2025-06-28 07:59:55','SALIDA',26),(64,'2025-06-28 22:16:14','ENTRADA',26),(65,'2025-06-28 22:16:15','ENTRADA',26),(66,'2025-06-28 23:54:03','ENTRADA',3),(67,'2025-06-29 08:26:04','ENTRADA',3),(68,'2025-06-29 19:16:15','ENTRADA',26),(69,'2025-06-29 19:18:34','ENTRADA',29),(70,'2025-06-29 19:26:22','SALIDA',29),(71,'2025-06-29 19:51:55','ENTRADA',30),(72,'2025-06-29 19:52:00','SALIDA',30),(73,'2025-06-29 19:52:01','SALIDA',30),(74,'2025-06-29 22:30:08','ENTRADA',31),(75,'2025-06-29 22:31:29','SALIDA',31);
/*!40000 ALTER TABLE `asistencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `categoria_id` bigint NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`categoria_id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (71,'CT Baracoa','Baracoa'),(72,'CA Maisi','Maisí'),(73,'CA Imias','Imías'),(74,'CT Yateras','Yateras'),(75,'CT San Antonio del Sur','San Antonio'),(76,'CT Caimanera','Caimanera'),(77,'GTMO','Guantánamo'),(78,'NP','Niceto Peres'),(79,'MT','Manuel Tames'),(80,'CA El Salvador','El Salvador');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `examenes`
--

DROP TABLE IF EXISTS `examenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `examenes` (
  `examen_id` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `numero_de_preguntas` varchar(255) DEFAULT NULL,
  `puntos_maximos` varchar(255) DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `categoria_categoria_id` bigint DEFAULT NULL,
  `prioridad` varchar(255) DEFAULT NULL,
  `categoria_del_cliente` varchar(255) DEFAULT NULL,
  `organismo` varchar(255) DEFAULT NULL,
  `consejo_popular` varchar(255) DEFAULT NULL,
  `costo_de_instalacion` varchar(255) DEFAULT NULL,
  `cuota` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `enlace` varchar(255) DEFAULT NULL,
  `municipio` varchar(255) DEFAULT NULL,
  `no_adsl` varchar(255) DEFAULT NULL,
  `numero_de_solicitud` varchar(255) DEFAULT NULL,
  `seguimiento` varchar(255) DEFAULT NULL,
  `soliciud` varchar(255) DEFAULT NULL,
  `telefono_de_contacto` varchar(255) DEFAULT NULL,
  `estado_del_servicio` varchar(255) DEFAULT NULL,
  `velocidad` varchar(255) DEFAULT NULL,
  `solicitud` varchar(255) DEFAULT NULL,
  `fecha_de_solicitud` date DEFAULT NULL,
  `estado_de_calificacion_de_los_centros` varchar(255) DEFAULT NULL,
  `evaluacion` varchar(255) DEFAULT NULL,
  `fecha_respuesta_calificacion_operaciones` date DEFAULT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  `observaciones_especialista_de_operaciones` varchar(255) DEFAULT NULL,
  `fecha_de_ejecucion_estimadaaproponer` date DEFAULT NULL,
  `propuesta_de_soluion_tecnica` varchar(255) DEFAULT NULL,
  `tipo_de_recursosademandar` varchar(255) DEFAULT NULL,
  `observacion_esp_inversiones` varchar(255) DEFAULT NULL,
  `tipo_de_servicio` varchar(255) DEFAULT NULL,
  `instalada` varchar(255) DEFAULT NULL,
  `programa_proyecto` varchar(255) DEFAULT NULL,
  `usuario_id` bigint DEFAULT NULL,
  `codigoqr` varchar(255) NOT NULL DEFAULT '',
  `campo_modificado` varchar(255) DEFAULT NULL,
  `fecha_ultima_modificacion` datetime DEFAULT NULL,
  `notificar_administrador` bit(1) NOT NULL,
  `usuario_que_modifico` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`examen_id`),
  KEY `FK9e3vkr595xf5ntcw0ih72lifw` (`categoria_categoria_id`),
  KEY `FKa027tdoo6kxwi3vhgobxn8j89` (`usuario_id`),
  CONSTRAINT `FK9e3vkr595xf5ntcw0ih72lifw` FOREIGN KEY (`categoria_categoria_id`) REFERENCES `categorias` (`categoria_id`),
  CONSTRAINT `FKa027tdoo6kxwi3vhgobxn8j89` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examenes`
--

LOCK TABLES `examenes` WRITE;
/*!40000 ALTER TABLE `examenes` DISABLE KEYS */;
INSERT INTO `examenes` VALUES (61,_binary '','Direccion Municipal de Deporte y Recreación','','','AZCUBA',71,'Alta','Proyectos_Priorizados','CANEC_SA','','we','t','Direccion municipal de deportes y recreacion','6767','','ewwe','4','DT',NULL,'34','Solicitud_Nueva','8Mbps','Alta','2024-10-23','Pdte_Puerta','Operaciones','2025-03-20','santo Se necesita de equipo tplink para su implementación','santo1',NULL,'d','iiii','pendiente a recursos',NULL,NULL,NULL,NULL,'',NULL,'2025-06-26 23:28:04',_binary '\0','www'),(62,_binary '','Consulado Habana','','','CONJUSOL',72,'Alta','Informatización_CTC','EMPA','gfg','as','f','ghhghg','dfdfdf','','f','1','VPCM',NULL,'sfsdfsdff','Con_OS_Siprec','4Mbps','Alta_Mig','2025-04-24','DI','Operaciones','2024-10-10','Parámetros del Cable incorrecto','Se requiere de cable UTP','2029-12-04','FO','100km','sa',NULL,NULL,NULL,NULL,'',NULL,'2025-06-27 00:18:20',_binary '\0','www'),(63,_binary '','Educación Salud','','','EPCONS',71,'Baja','Sin_Clasificación','Fondo_Cubano','baitiquiri','trt','fd','ewewewewe','4433','','445df','22','DT',NULL,'2323','Solicitud_Nueva','155Mbps','CL','2025-04-02','No_Apto','Operaciones','2025-04-15','No disponibilidad','Revisar',NULL,'','','',NULL,NULL,NULL,NULL,'',NULL,'2025-06-26 23:27:51',_binary '\0','www'),(64,_binary '','dffdffddd','','','MES',73,'Alta','MIPYMES','MES','43443','rttrtr','trtrtr','56565','fdf54','','454','23','VPCM',NULL,'fgf','Solicitud_Nueva','2Mbps','CL','2025-04-03','DI','Operaciones','2024-11-11','','',NULL,'','','',NULL,NULL,NULL,NULL,'',NULL,NULL,_binary '\0',NULL),(65,_binary '','tyyty','','','GAF',75,'Alta','Informatización_PCC','GAF','ddd','tyy','yty','fgtf','tytyt','','ttyyy','66','VPCM',NULL,'tytyyt','Con_OS_Siprec','4Mbps','Baja','2025-04-03','','Operaciones',NULL,'','',NULL,'','','',NULL,'Pendiente_de_Inlalacion',NULL,NULL,'',NULL,NULL,_binary '\0',NULL),(66,_binary '','san','','','Otros',76,'Alta','MINED','Otro','r3','g','g','ereetr','dffdd','','f454','4','VPCM',NULL,'4gfgffg','Con_OS_Siprec','10Mbps','Alta','2025-04-03','DI','Operaciones','2025-04-11','Pendiente a FO','Se requieren 62m','2086-12-04','','','',NULL,NULL,NULL,NULL,'',NULL,NULL,_binary '\0',NULL),(67,_binary '','RADIOCUBA','','','PCC',74,'Baja','Informatización_PCC','PCC','err','55','erer','erre','rer','','ere','34','DT',NULL,'43454','OK_Red_Móvil','20Mbps','Baja','2025-04-12','Pdte_Puerta','Operaciones','2025-04-30','INA','ina1','2025-04-12','','','',NULL,NULL,NULL,NULL,'','estadoDeCalificacionDeLosCentros','2025-06-27 00:31:56',_binary '','www'),(68,_binary '','citma','','','CITMA',80,'Baja','MIPYMES','CITMA','tr','fdfdf','4ghh','yuyu','454545','','4555','54','VPCM',NULL,'445','En_Proceso','10Mbps','CVIV','2025-02-10','','',NULL,'','','2025-04-13','','','',NULL,NULL,NULL,NULL,'',NULL,NULL,_binary '\0',NULL),(69,_binary '','artex','','','Artex',73,'Baja','Proyectos_Priorizados','Artex','erer','cv','hjj','reere','tt','','trt','3','VPCM',NULL,'545','Solicitud_Nueva','80Mbps','CL','2025-02-25','No_Apto','Inversiones','2025-04-13','','','2025-04-13','','','',NULL,NULL,NULL,NULL,'',NULL,NULL,_binary '\0',NULL),(71,_binary '','Centro Comercial El Salvador Suministro Agropecuario','','','EMPA',80,'Alta','MINED','MINAG','Bayate','910','140','Bayate','','','212811112','100','VPCM',NULL,'','DI','2Mbps','Alta','2025-04-16','','',NULL,'','','2025-04-16','','','',NULL,NULL,NULL,NULL,'',NULL,NULL,_binary '\0',NULL),(72,_binary '','Solvisión Internet','','','ICRT',77,'Baja','Proyectos_Priorizados','ICRT','Caribe','144','123','Calle 13 Norte #1151 Esq. 5 Oeste. ','GTED3435','','','1','DT',NULL,'3453535','OK','20Mbps','Alta','2024-02-06','','',NULL,'','','2025-04-17','','','','Dedicado_Internacional','Instalada','Otros_Programas',NULL,'',NULL,NULL,_binary '\0',NULL),(73,_binary '','qq','','','Artex',75,'','','Artex','Mártires-de-la-Frontera','','','qq','','','','4','',NULL,'','Solicitud_Nueva','2Mbps','Alta','2025-06-22','DI','Operaciones','2025-06-26','se necesita de equipo VDSL','Transferir del almacen 8085','2025-06-22','','','','','','',NULL,'','estadoDeCalificacionDeLosCentros','2025-06-27 00:39:24',_binary '','s'),(74,_binary '','admin','','','ADMIN',71,'','','ADMIN','Cabacú','','','','','','','4','',NULL,'','Solicitud_Nueva','Paquete_Móvil','Alta','2025-06-22','','Operaciones',NULL,'','','2025-06-22','','','','','','',NULL,'',NULL,'2025-06-27 00:31:39',_binary '\0','www'),(75,_binary '','WW','','','CIMEX',75,'','','CITMA','Mandinga','','','WW','','','','2','',NULL,'','Con_OS_Siprec','2Mbps','','2025-06-22','','Inversiones',NULL,'','','2025-06-22','fq','','','','','',NULL,'',NULL,'2025-06-26 22:55:08',_binary '\0','www');
/*!40000 ALTER TABLE `examenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preguntas`
--

DROP TABLE IF EXISTS `preguntas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preguntas` (
  `pregunta_id` bigint NOT NULL AUTO_INCREMENT,
  `contenido` varchar(5000) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `opcion2` varchar(255) DEFAULT NULL,
  `opcion3` varchar(255) DEFAULT NULL,
  `opcion4` varchar(255) DEFAULT NULL,
  `respuesta` varchar(255) DEFAULT NULL,
  `examen_examen_id` bigint DEFAULT NULL,
  `opcion1` varchar(255) DEFAULT NULL,
  `respuesta_dada` varchar(255) DEFAULT NULL,
  `estado_de_calificacion_de_los_centros` varchar(255) DEFAULT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  `evaluacion` varchar(255) DEFAULT NULL,
  `observaciones_especialista_de_operaciones` varchar(255) DEFAULT NULL,
  `fecha_respuesta_calificacion_operciones` datetime(6) DEFAULT NULL,
  `fecha_respuesta_calificacion_operaciones` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`pregunta_id`),
  KEY `FK9g0sx7pv0vsvc4uksis4egp4j` (`examen_examen_id`),
  CONSTRAINT `FK9g0sx7pv0vsvc4uksis4egp4j` FOREIGN KEY (`examen_examen_id`) REFERENCES `examenes` (`examen_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preguntas`
--

LOCK TABLES `preguntas` WRITE;
/*!40000 ALTER TABLE `preguntas` DISABLE KEYS */;
/*!40000 ALTER TABLE `preguntas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `rol_id` bigint NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`rol_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN'),(2,'NORMAL');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_rol`
--

DROP TABLE IF EXISTS `usuario_rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_rol` (
  `usuario_rol_id` bigint NOT NULL AUTO_INCREMENT,
  `rol_rol_id` bigint DEFAULT NULL,
  `usuario_id` bigint DEFAULT NULL,
  PRIMARY KEY (`usuario_rol_id`),
  KEY `FK7j1tyvjj1tv8gbq7n6f7efccc` (`rol_rol_id`),
  KEY `FKktsemf1f6awjww4da0ocv4n32` (`usuario_id`),
  CONSTRAINT `FK7j1tyvjj1tv8gbq7n6f7efccc` FOREIGN KEY (`rol_rol_id`) REFERENCES `roles` (`rol_id`),
  CONSTRAINT `FKktsemf1f6awjww4da0ocv4n32` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_rol`
--

LOCK TABLES `usuario_rol` WRITE;
/*!40000 ALTER TABLE `usuario_rol` DISABLE KEYS */;
INSERT INTO `usuario_rol` VALUES (1,1,1),(2,1,2),(3,2,3),(10,2,10),(25,2,25),(26,2,26),(27,2,27),(28,2,28),(29,2,29),(30,2,30),(31,2,31);
/*!40000 ALTER TABLE `usuario_rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `apellido` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `enabled` bit(1) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `perfil` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `ctlc` varchar(255) DEFAULT NULL,
  `hora_salida` datetime DEFAULT NULL,
  `hora_entrada` datetime DEFAULT NULL,
  `dni` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Girandy','santos.columbie@etecsa.cu',_binary '','santod','$2a$10$voB65MxwxHk3ydfhvf.lXOLG0b0qt0FnL9fJ3dgzrnBRQZ1TaFuwe','foto.pnp','59888006','santod',NULL,NULL,NULL,'0'),(2,'Girandy','santos.columbie@etecsa.cu',_binary '','santodgc','$2a$10$9T.mNHVq.1mD/s20zL0exuZP5.So2YL5bNdeugJAsCk2/hO0FrqSC','foto.pnp','59888006','santodgc',NULL,NULL,NULL,'0'),(3,'web','www@w.cu',_binary '','web','$2a$10$o3geM/0I7tLMfdhSUtItaOQv0dK5wU67JHZbxkx.Ri.zuHCjc1yDm','defaul.png','2313313233','www','Baracoa','2025-06-19 23:38:49','2025-06-19 23:39:39','0'),(10,'ccc','cc@ff.gh',_binary '','ccc','$2a$10$e/HpX.odTF8r29ye8Tl.0O1GiGsJPhVchSXmfRrrXgmMto4HsJyOC','defaul.png','345','ccc','baracoa','2025-06-21 23:17:25','2025-06-21 23:16:35','0'),(25,'s','s@um.ni',_binary '','s','$2a$10$mCqUW3saYaw79VTohOvzHOrNOCeApVZQL7dsU7Tq8HGB1Pu13mwaC','defaul.png','23333','s','Bcoa','2025-06-24 22:29:34','2025-06-24 22:28:54','0'),(26,'a','a@hu.vi',_binary '','a','$2a$10$9LWGVzQz57zYfZs8ABe1FeQnRj3UeZiePfKJ.2z2QbimpDWxZ1NYy','defaul.png','122323','a','gtmo',NULL,NULL,'0'),(27,'w','sati@bmn.cu',_binary '','w','$2a$10$uwCFblVryVRWf2g.uQmpOexQRJKJ9dnROw/aLxEIbjc2.88k7t4Fm','defaul.png','333','w','Yateras',NULL,NULL,'0'),(28,'z','z@nj.cu',_binary '','z','$2a$10$wL6L1pC59G.WdMTnNrWUU..N.3oC1AMel9R4IaMo4olRSXdbAmlre','defaul.png','33344','z','Baracoa',NULL,NULL,'0'),(29,'ee','e@rm.cf',_binary '','eulide','$2a$10$mhsIxibbME0ReIq/RO/ofuvQyF1OV4fJURrMbO4MIMH5eWI5WcMNe','defaul.png','31222342','e','baracoa',NULL,NULL,'0'),(30,'Reyes','aban@kiquillo-tania',_binary '','Juan Alberto','$2a$10$7NJjY0gHOdp6E/zF365ENe3dOlU9yrXR.2.SnZOxwd.VBuqbJ/M9q','defaul.png','45678912','j','Salvador',NULL,NULL,'0'),(31,'yuuo','tito@gy.bi',_binary '','tito','$2a$10$tr.ZfGTJOqyoO/LpCIcs4emOCQ33NRBqOKaMyIhfuQ/8ev2k4.wFi','defaul.png','123456','t','Guantánamo',NULL,NULL,'12345678901');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-29 23:39:49
