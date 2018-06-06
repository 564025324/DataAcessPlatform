
package com.guosen.bj.sop.downdata.action;

import java.io.File;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.guosen.bj.sop.downdata.service.DownDataService;
import com.opensymphony.xwork2.ActionSupport;

public class DownDataAction extends ActionSupport {
	private static final long serialVersionUID = 1L;

	private DownDataService ddataService;
	private File upload;
	private InputStream downloadFile;
	private String downloadFileName;

	/**
	 * 首页跳转 -- 互产部
	 * 
	 * @return
	 */
	public String ppkhInfoForward() {
		return SUCCESS;
	}

	/**
	 * 导入文件 - 互产部
	 * 
	 * @return
	 */
	public String ppkhImportFile() {
		try {
			System.out.println("enter ddaction - ppkhImportFile");
			ddataService.importFile(upload);
		} catch (Exception e) {
			e.printStackTrace();
			return ERROR;
		}
		return SUCCESS;
	}

	/**
	 * 导出文件 - 互产部 -客户信息匹配
	 * 
	 * @return
	 */
	public String ppkhExportExcel() {
		Date day = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy_MM_dd");
		String nowtime = sdf.format(day);
		
		
		ddataService.execProc_hcdept_ppkhInfo(nowtime);
		downloadFile = ddataService.ppkhExportResult(nowtime);

		downloadFileName = "提数结果-互产部-匹配客户信息_" + nowtime + ".xls";
		try {
			// downloadFileName = StringTools.getExpXlsISOFileName(downloadFileName);
			downloadFileName = new String(downloadFileName.getBytes("GBK"), "ISO8859-1");
		} catch (Exception e) {
			e.printStackTrace();
			return ERROR;
		}
		return SUCCESS;
	}

	public File getUpload() {
		return upload;
	}

	public void setUpload(File upload) {
		this.upload = upload;
	}

	public DownDataService getDdataService() {
		return ddataService;
	}

	public void setDdataService(DownDataService ddataService) {
		this.ddataService = ddataService;
	}

	public InputStream getDownloadFile() {
		return downloadFile;
	}

	public void setDownloadFile(InputStream downloadFile) {
		this.downloadFile = downloadFile;
	}

	public String getDownloadFileName() {
		return downloadFileName;
	}

	public void setDownloadFileName(String downloadFileName) {
		this.downloadFileName = downloadFileName;
	}

}