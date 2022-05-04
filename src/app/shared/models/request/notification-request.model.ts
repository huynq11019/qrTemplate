export class NotificationRequest {
  constructor(
    public title?: string,
    public buildingIds?: [],
    public floorIds?: [],
    public customerIds?: [],
    public dataBody?: string,
    public note?: string,
    public fileIds?: [],
  ) {
    this.title = title;
    this.buildingIds = buildingIds;
    this.floorIds = floorIds;
    this.customerIds = customerIds;
    this.dataBody = dataBody;
    this.note = note;
    this.fileIds = fileIds;
  }
}
