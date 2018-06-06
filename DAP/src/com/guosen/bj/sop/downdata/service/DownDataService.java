
package com.guosen.bj.sop.downdata.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.util.LinkedCaseInsensitiveMap;

public class DownDataService {

	private InputStream downloadFile;

	public void importFile(File file) {

		HSSFWorkbook workbook;
		try {
			workbook = new HSSFWorkbook(new FileInputStream(file));
			HSSFSheet sheet = workbook.getSheetAt(0);
			sheet.getPhysicalNumberOfRows();
			HSSFRow firstRow = sheet.getRow(sheet.getFirstRowNum());
			int firstRowNum = firstRow.getPhysicalNumberOfCells();
			System.out.println("firstRowNum : " + firstRowNum);
			// 首先确保导入数据中包含手机号和姓名

			String a = sheet.getRow(0).getCell(0).getStringCellValue();
			// 对列数进行循环，将数据插入
			System.out.println("a :" + a);

			// TODO：二期：完善提示信息
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 根据导入的文件客户名单，进行筛查客户数据
	 */
	public void execProc_hcdept_ppkhInfo(String currentday) {
		// String sql ="";
		// GxbjDao.exec(sql);
	}
	
	private LinkedCaseInsensitiveMap ppkhInfoResult() {
		
		return new LinkedCaseInsensitiveMap();
	}

	public InputStream ppkhExportResult(String currentday) {
		
		
		// 新建文件
		HSSFWorkbook workbook = new HSSFWorkbook();
		HSSFSheet sheet = workbook.createSheet("提数结果_" + currentday);
		
		
		
		
		
		return downloadFile;
	}

}